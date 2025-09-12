import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Shield, Key, Smartphone, AlertCircle, CheckCircle, Copy } from 'lucide-react';

interface WebAuthnSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WebAuthnSetup({ isOpen, onClose, onSuccess }: WebAuthnSetupProps) {
  const [step, setStep] = useState(1);
  const [isSupported, setIsSupported] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [credentialName, setCredentialName] = useState('');

  useEffect(() => {
    checkWebAuthnSupport();
    if (isOpen) {
      fetchExistingCredentials();
    }
  }, [isOpen]);

  const checkWebAuthnSupport = async () => {
    try {
      const response = await fetch('/api/webauthn/support');
      const data = await response.json();
      setIsSupported(data.supported);
    } catch (error) {
      console.error('Failed to check WebAuthn support:', error);
      setIsSupported(false);
    }
  };

  const fetchExistingCredentials = async () => {
    try {
      const response = await fetch('/api/webauthn/credentials', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCredentials(data.credentials);
      }
    } catch (error) {
      console.error('Failed to fetch credentials:', error);
    }
  };

  const startRegistration = async () => {
    if (!credentialName.trim()) {
      setError('Please enter a name for your authenticator');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get registration options from server
      const optionsResponse = await fetch('/api/webauthn/register/begin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const optionsData = await optionsResponse.json();
      if (!optionsData.success) {
        throw new Error(optionsData.error);
      }

      const options = optionsData.options;

      // Convert base64url strings to ArrayBuffers
      options.challenge = base64urlToArrayBuffer(options.challenge);
      options.user.id = base64urlToArrayBuffer(options.user.id);

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: options
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to create credential');
      }

      // Prepare credential for server
      const credentialData = {
        id: credential.id,
        rawId: arrayBufferToBase64url(credential.rawId),
        response: {
          clientDataJSON: arrayBufferToBase64url(credential.response.clientDataJSON),
          attestationObject: arrayBufferToBase64url((credential.response as AuthenticatorAttestationResponse).attestationObject)
        },
        type: credential.type
      };

      // Send credential to server
      const verifyResponse = await fetch('/api/webauthn/register/complete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          credential: credentialData,
          challenge: optionsData.options.challenge,
          credentialName: credentialName
        })
      });

      const verifyData = await verifyResponse.json();
      if (!verifyData.success) {
        throw new Error(verifyData.error);
      }

      // Show backup codes if this is the first credential
      if (verifyData.backupCodes) {
        setBackupCodes(verifyData.backupCodes);
        setStep(3);
      } else {
        setStep(4);
      }

      await fetchExistingCredentials();

    } catch (error: any) {
      console.error('WebAuthn registration failed:', error);
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const removeCredential = async (credentialId: string) => {
    try {
      const response = await fetch(`/api/webauthn/credentials/${credentialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        await fetchExistingCredentials();
      } else {
        setError(data.error);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'webauthn-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper functions for base64url conversion
  const base64urlToArrayBuffer = (base64url: string): ArrayBuffer => {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const binary = atob(padded);
    const buffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) {
      view[i] = binary.charCodeAt(i);
    }
    return buffer;
  };

  const arrayBufferToBase64url = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  };

  const renderStep1 = () => (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Fingerprint className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Your Account</h3>
      <p className="text-gray-600 mb-6">
        Add biometric authentication for enhanced security. Use your fingerprint, face, or security key to sign in.
      </p>

      {!isSupported ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">WebAuthn Not Supported</span>
          </div>
          <p className="text-red-700 text-sm mt-1">
            Your browser doesn't support WebAuthn. Please use a modern browser like Chrome, Firefox, or Safari.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Fingerprint className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Fingerprint</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Smartphone className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Face ID</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Key className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-sm text-gray-600">Security Key</p>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Set Up Biometric Authentication
          </button>
        </div>
      )}

      {credentials.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Existing Authenticators</h4>
          <div className="space-y-2">
            {credentials.map((cred, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">{cred.name}</p>
                    <p className="text-sm text-gray-500">
                      Added {new Date(cred.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeCredential(cred.credentialId)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Fingerprint className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Authenticator</h3>
      <p className="text-gray-600 mb-6">
        Give your authenticator a name and follow the prompts to register it.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Authenticator Name
          </label>
          <input
            type="text"
            value={credentialName}
            onChange={(e) => setCredentialName(e.target.value)}
            placeholder="e.g., iPhone Touch ID, YubiKey"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={() => setStep(1)}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={startRegistration}
            disabled={loading || !credentialName.trim()}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Registering...' : 'Register Authenticator'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Key className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Your Backup Codes</h3>
      <p className="text-gray-600 mb-6">
        These codes can be used to access your account if you lose your authenticator. Store them safely!
      </p>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
          {backupCodes.map((code, index) => (
            <div key={index} className="bg-white p-2 rounded border">
              {code}
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-3 mb-6">
        <button
          onClick={copyBackupCodes}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
        >
          <Copy className="h-4 w-4" />
          <span>Copy Codes</span>
        </button>
        <button
          onClick={downloadBackupCodes}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Download
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="text-left">
            <p className="font-medium text-yellow-800">Important:</p>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• Each code can only be used once</li>
              <li>• Store them in a secure location</li>
              <li>• Don't share them with anyone</li>
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={() => setStep(4)}
        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        I've Saved My Backup Codes
      </button>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Setup Complete!</h3>
      <p className="text-gray-600 mb-6">
        Your biometric authentication is now active. You can use it to sign in securely.
      </p>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-green-800">
          <Shield className="h-5 w-5" />
          <span className="font-medium">Your account is now more secure</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          You can now sign in using your fingerprint, face, or security key.
        </p>
      </div>

      <button
        onClick={() => {
          onSuccess();
          onClose();
        }}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Done
      </button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}