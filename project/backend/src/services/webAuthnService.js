const crypto = require('crypto');

class WebAuthnService {
  constructor() {
    this.rpName = 'PM Internship Portal';
    this.rpId = process.env.WEBAUTHN_RP_ID || 'localhost';
    this.origin = process.env.WEBAUTHN_ORIGIN || 'http://localhost:5173';
    this.challenges = new Map(); // In production, use Redis
  }

  // Generate registration options
  generateRegistrationOptions(user) {
    const challenge = crypto.randomBytes(32);
    const challengeBase64 = challenge.toString('base64url');
    
    // Store challenge temporarily (expires in 5 minutes)
    this.challenges.set(challengeBase64, {
      userId: user.id,
      timestamp: Date.now(),
      type: 'registration'
    });

    // Clean up expired challenges
    this.cleanupExpiredChallenges();

    const options = {
      challenge: challengeBase64,
      rp: {
        name: this.rpName,
        id: this.rpId
      },
      user: {
        id: Buffer.from(user.id).toString('base64url'),
        name: user.email,
        displayName: user.name
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' } // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'preferred',
        requireResidentKey: false
      },
      timeout: 300000, // 5 minutes
      attestation: 'none'
    };

    return options;
  }

  // Generate authentication options
  generateAuthenticationOptions(user) {
    const challenge = crypto.randomBytes(32);
    const challengeBase64 = challenge.toString('base64url');
    
    // Store challenge temporarily
    this.challenges.set(challengeBase64, {
      userId: user.id,
      timestamp: Date.now(),
      type: 'authentication'
    });

    this.cleanupExpiredChallenges();

    const options = {
      challenge: challengeBase64,
      timeout: 300000,
      rpId: this.rpId,
      userVerification: 'preferred'
    };

    // If user has existing credentials, include them
    if (user.webAuthnCredentials && user.webAuthnCredentials.length > 0) {
      options.allowCredentials = user.webAuthnCredentials.map(cred => ({
        id: cred.credentialId,
        type: 'public-key',
        transports: cred.transports || ['internal']
      }));
    }

    return options;
  }

  // Verify registration response
  async verifyRegistrationResponse(response, expectedChallenge) {
    try {
      const challengeData = this.challenges.get(expectedChallenge);
      if (!challengeData || challengeData.type !== 'registration') {
        throw new Error('Invalid or expired challenge');
      }

      // Remove used challenge
      this.challenges.delete(expectedChallenge);

      // In a real implementation, you would:
      // 1. Verify the attestation object
      // 2. Validate the client data JSON
      // 3. Check the challenge matches
      // 4. Verify the origin
      // 5. Extract and validate the public key

      // For this demo, we'll do basic validation
      const clientDataJSON = JSON.parse(
        Buffer.from(response.clientDataJSON, 'base64url').toString()
      );

      if (clientDataJSON.type !== 'webauthn.create') {
        throw new Error('Invalid client data type');
      }

      if (clientDataJSON.challenge !== expectedChallenge) {
        throw new Error('Challenge mismatch');
      }

      if (clientDataJSON.origin !== this.origin) {
        throw new Error('Origin mismatch');
      }

      // Extract credential data (simplified)
      const attestationObject = Buffer.from(response.attestationObject, 'base64url');
      
      // In production, parse CBOR and extract public key
      const credentialData = {
        credentialId: response.id,
        publicKey: response.publicKey || 'mock-public-key', // Would be extracted from attestation
        counter: 0,
        transports: response.transports || ['internal'],
        createdAt: new Date()
      };

      return {
        verified: true,
        credentialData
      };

    } catch (error) {
      console.error('WebAuthn registration verification failed:', error);
      return {
        verified: false,
        error: error.message
      };
    }
  }

  // Verify authentication response
  async verifyAuthenticationResponse(response, expectedChallenge, storedCredential) {
    try {
      const challengeData = this.challenges.get(expectedChallenge);
      if (!challengeData || challengeData.type !== 'authentication') {
        throw new Error('Invalid or expired challenge');
      }

      // Remove used challenge
      this.challenges.delete(expectedChallenge);

      const clientDataJSON = JSON.parse(
        Buffer.from(response.clientDataJSON, 'base64url').toString()
      );

      if (clientDataJSON.type !== 'webauthn.get') {
        throw new Error('Invalid client data type');
      }

      if (clientDataJSON.challenge !== expectedChallenge) {
        throw new Error('Challenge mismatch');
      }

      if (clientDataJSON.origin !== this.origin) {
        throw new Error('Origin mismatch');
      }

      // In production, verify the signature using the stored public key
      // For now, we'll do basic validation
      
      const authenticatorData = Buffer.from(response.authenticatorData, 'base64url');
      
      // Check if user was present (UP flag)
      const flags = authenticatorData[32];
      const userPresent = !!(flags & 0x01);
      const userVerified = !!(flags & 0x04);

      if (!userPresent) {
        throw new Error('User not present');
      }

      // Extract and verify counter (simplified)
      const counter = authenticatorData.readUInt32BE(33);
      
      if (counter <= storedCredential.counter) {
        throw new Error('Invalid counter value - possible replay attack');
      }

      return {
        verified: true,
        newCounter: counter,
        userVerified
      };

    } catch (error) {
      console.error('WebAuthn authentication verification failed:', error);
      return {
        verified: false,
        error: error.message
      };
    }
  }

  // Clean up expired challenges (older than 5 minutes)
  cleanupExpiredChallenges() {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    
    for (const [challenge, data] of this.challenges.entries()) {
      if (data.timestamp < fiveMinutesAgo) {
        this.challenges.delete(challenge);
      }
    }
  }

  // Check if WebAuthn is supported by checking for required APIs
  isWebAuthnSupported(userAgent) {
    // Basic user agent detection for WebAuthn support
    const supportedBrowsers = [
      /Chrome\/(\d+)/, // Chrome 67+
      /Firefox\/(\d+)/, // Firefox 60+
      /Safari\/(\d+)/, // Safari 14+
      /Edge\/(\d+)/ // Edge 18+
    ];

    return supportedBrowsers.some(regex => {
      const match = userAgent.match(regex);
      if (!match) return false;
      
      const version = parseInt(match[1]);
      if (userAgent.includes('Chrome')) return version >= 67;
      if (userAgent.includes('Firefox')) return version >= 60;
      if (userAgent.includes('Safari')) return version >= 14;
      if (userAgent.includes('Edge')) return version >= 18;
      
      return false;
    });
  }

  // Generate backup codes for account recovery
  generateBackupCodes(count = 10) {
    const codes = [];
    
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric code
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }
    
    return codes;
  }

  // Validate backup code
  validateBackupCode(providedCode, storedCodes) {
    const normalizedCode = providedCode.toUpperCase().replace(/\s/g, '');
    
    const codeIndex = storedCodes.findIndex(code => 
      code.code === normalizedCode && !code.used
    );
    
    if (codeIndex === -1) {
      return { valid: false, error: 'Invalid or already used backup code' };
    }
    
    // Mark code as used
    storedCodes[codeIndex].used = true;
    storedCodes[codeIndex].usedAt = new Date();
    
    return { valid: true, remainingCodes: storedCodes.filter(c => !c.used).length };
  }
}

const webAuthnService = new WebAuthnService();

module.exports = { webAuthnService };