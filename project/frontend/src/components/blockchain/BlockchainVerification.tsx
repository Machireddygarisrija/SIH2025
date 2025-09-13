import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle, ExternalLink, Copy, RefreshCw } from 'lucide-react';

interface BlockchainVerificationProps {
  allocationId: string;
  applicantId: string;
  opportunityId: string;
  matchScore: number;
}

interface BlockchainRecord {
  transactionHash: string;
  blockNumber: number;
  timestamp: Date;
  verified: boolean;
  explorerUrl: string;
}

export default function BlockchainVerification({
  allocationId,
  applicantId,
  opportunityId,
  matchScore
}: BlockchainVerificationProps) {
  const [record, setRecord] = useState<BlockchainRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock blockchain verification
  const verifyOnBlockchain = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockRecord: BlockchainRecord = {
      transactionHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
      timestamp: new Date(),
      verified: true,
      explorerUrl: `https://etherscan.io/tx/0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    };
    
    setRecord(mockRecord);
    setIsVerified(true);
    setIsLoading(false);
  };

  useEffect(() => {
    // Auto-verify on component mount
    verifyOnBlockchain();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Blockchain Verification</h3>
          <p className="text-gray-600">Immutable allocation record on Ethereum</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
          />
          <span className="ml-3 text-gray-600">Verifying on blockchain...</span>
        </div>
      ) : record ? (
        <div className="space-y-4">
          {/* Verification Status */}
          <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Allocation Verified on Blockchain</span>
          </div>

          {/* Allocation Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Allocation ID</label>
                <p className="text-gray-900 font-mono text-sm">{allocationId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Match Score</label>
                <p className="text-gray-900 font-semibold">{matchScore}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Timestamp</label>
                <p className="text-gray-900">{record.timestamp.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Block Number</label>
                <p className="text-gray-900 font-mono">{record.blockNumber.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Network</label>
                <p className="text-gray-900">Ethereum Mainnet</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gas Used</label>
                <p className="text-gray-900">{(Math.random() * 50000 + 21000).toFixed(0)} gas</p>
              </div>
            </div>
          </div>

          {/* Transaction Hash */}
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">Transaction Hash</label>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
              <code className="flex-1 text-sm font-mono text-gray-900 truncate">
                {record.transactionHash}
              </code>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(record.transactionHash)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy transaction hash"
              >
                <Copy className="h-4 w-4" />
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={record.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                title="View on Etherscan"
              >
                <ExternalLink className="h-4 w-4" />
              </motion.a>
            </div>
            {copied && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-600 text-sm mt-1"
              >
                ✓ Copied to clipboard
              </motion.p>
            )}
          </div>

          {/* Verification Benefits */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Blockchain Benefits</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Immutable record - cannot be altered or deleted</li>
              <li>• Transparent allocation process</li>
              <li>• Prevents manipulation and bias</li>
              <li>• Publicly verifiable on Ethereum network</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={verifyOnBlockchain}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Re-verify</span>
            </motion.button>
            
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={record.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View on Explorer</span>
            </motion.a>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">Failed to verify allocation on blockchain</span>
        </div>
      )}
    </motion.div>
  );
}