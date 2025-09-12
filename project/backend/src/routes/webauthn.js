const express = require('express');
const auth = require('../middleware/auth');
const { webAuthnService } = require('../services/webAuthnService');
const User = require('../models/User');

const router = express.Router();

// Check WebAuthn support
router.get('/support', (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const supported = webAuthnService.isWebAuthnSupported(userAgent);
  
  res.json({
    success: true,
    supported,
    userAgent: userAgent.substring(0, 100) // Truncate for privacy
  });
});

// Generate registration options
router.post('/register/begin', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const options = webAuthnService.generateRegistrationOptions(user);
    
    res.json({
      success: true,
      options
    });

  } catch (error) {
    console.error('WebAuthn registration begin failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Complete registration
router.post('/register/complete', auth, async (req, res) => {
  try {
    const { credential, challenge } = req.body;
    
    if (!credential || !challenge) {
      return res.status(400).json({
        success: false,
        error: 'Missing credential or challenge'
      });
    }

    const verification = await webAuthnService.verifyRegistrationResponse(credential, challenge);
    
    if (!verification.verified) {
      return res.status(400).json({
        success: false,
        error: verification.error || 'Registration verification failed'
      });
    }

    // Save credential to user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Initialize webAuthnCredentials array if it doesn't exist
    if (!user.webAuthnCredentials) {
      user.webAuthnCredentials = [];
    }

    // Add new credential
    user.webAuthnCredentials.push({
      credentialId: verification.credentialData.credentialId,
      publicKey: verification.credentialData.publicKey,
      counter: verification.credentialData.counter,
      transports: verification.credentialData.transports,
      createdAt: verification.credentialData.createdAt,
      name: req.body.credentialName || `Authenticator ${user.webAuthnCredentials.length + 1}`
    });

    // Generate backup codes if this is the first credential
    if (user.webAuthnCredentials.length === 1) {
      const backupCodes = webAuthnService.generateBackupCodes();
      user.backupCodes = backupCodes.map(code => ({
        code,
        used: false,
        createdAt: new Date()
      }));
    }

    await user.save();

    res.json({
      success: true,
      message: 'WebAuthn credential registered successfully',
      credentialId: verification.credentialData.credentialId,
      backupCodes: user.webAuthnCredentials.length === 1 ? user.backupCodes.map(c => c.code) : undefined
    });

  } catch (error) {
    console.error('WebAuthn registration complete failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate authentication options
router.post('/authenticate/begin', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const user = await User.findOne({ email });
    if (!user || !user.webAuthnCredentials || user.webAuthnCredentials.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No WebAuthn credentials found for this user'
      });
    }

    const options = webAuthnService.generateAuthenticationOptions(user);
    
    res.json({
      success: true,
      options
    });

  } catch (error) {
    console.error('WebAuthn authentication begin failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Complete authentication
router.post('/authenticate/complete', async (req, res) => {
  try {
    const { credential, challenge, email } = req.body;
    
    if (!credential || !challenge || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Find the credential
    const storedCredential = user.webAuthnCredentials.find(
      cred => cred.credentialId === credential.id
    );

    if (!storedCredential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }

    const verification = await webAuthnService.verifyAuthenticationResponse(
      credential, 
      challenge, 
      storedCredential
    );
    
    if (!verification.verified) {
      return res.status(400).json({
        success: false,
        error: verification.error || 'Authentication verification failed'
      });
    }

    // Update counter
    storedCredential.counter = verification.newCounter;
    storedCredential.lastUsed = new Date();
    await user.save();

    // Generate JWT token (reuse existing auth logic)
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'WebAuthn authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      userVerified: verification.userVerified
    });

  } catch (error) {
    console.error('WebAuthn authentication complete failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's WebAuthn credentials
router.get('/credentials', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('webAuthnCredentials backupCodes');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const credentials = (user.webAuthnCredentials || []).map(cred => ({
      credentialId: cred.credentialId,
      name: cred.name,
      createdAt: cred.createdAt,
      lastUsed: cred.lastUsed,
      transports: cred.transports
    }));

    const backupCodesCount = user.backupCodes ? 
      user.backupCodes.filter(code => !code.used).length : 0;

    res.json({
      success: true,
      credentials,
      backupCodesCount,
      hasWebAuthn: credentials.length > 0
    });

  } catch (error) {
    console.error('Failed to get WebAuthn credentials:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Remove WebAuthn credential
router.delete('/credentials/:credentialId', auth, async (req, res) => {
  try {
    const { credentialId } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (!user.webAuthnCredentials) {
      return res.status(404).json({
        success: false,
        error: 'No WebAuthn credentials found'
      });
    }

    const credentialIndex = user.webAuthnCredentials.findIndex(
      cred => cred.credentialId === credentialId
    );

    if (credentialIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }

    user.webAuthnCredentials.splice(credentialIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'WebAuthn credential removed successfully'
    });

  } catch (error) {
    console.error('Failed to remove WebAuthn credential:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Authenticate with backup code
router.post('/backup-code', async (req, res) => {
  try {
    const { email, backupCode } = req.body;
    
    if (!email || !backupCode) {
      return res.status(400).json({
        success: false,
        error: 'Email and backup code are required'
      });
    }

    const user = await User.findOne({ email });
    if (!user || !user.backupCodes) {
      return res.status(404).json({
        success: false,
        error: 'Invalid backup code'
      });
    }

    const validation = webAuthnService.validateBackupCode(backupCode, user.backupCodes);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    await user.save();

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Backup code authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      remainingBackupCodes: validation.remainingCodes
    });

  } catch (error) {
    console.error('Backup code authentication failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate new backup codes
router.post('/backup-codes/regenerate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const newBackupCodes = webAuthnService.generateBackupCodes();
    user.backupCodes = newBackupCodes.map(code => ({
      code,
      used: false,
      createdAt: new Date()
    }));

    await user.save();

    res.json({
      success: true,
      message: 'New backup codes generated',
      backupCodes: newBackupCodes
    });

  } catch (error) {
    console.error('Failed to regenerate backup codes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;