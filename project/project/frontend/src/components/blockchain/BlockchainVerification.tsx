import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ExternalLink, CheckCircle, AlertCircle, Clock, Copy } from 'lucide-react';

interface BlockchainRecord {
  transactionHash: string;
  blockNumber: number;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
  explorerUrl: string;
  gasUsed?: number;
}

interface BlockchainVerificationProps {
  allocationId: string;
  applicantId: string;
  opportunityId: string;
  matchScore: number;
}

export default function BlockchainVerification({ 
  allocationId, 
  applicantId, 
  opportunityId, 
  matchScore 
}: BlockchainVerificationProps) {
  const [record, setRecord] = useState<BlockchainRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'pending' | 'failed'>('pending');

  useEffect(() => {
    fetchBlockchainRecord();
  }, [allocationId]);

  const fetchBlockchainRecord = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blockchain/allocation/${allocationId}`);
      const data = await response.json();
      
      if (data.success) {
        setRecord(data.record);
        setVerificationStatus('verified');
      } else {
        setVerificationStatus('failed');
      }
    } catch (error) {
      console.error('Failed to fetch blockchain record:', error);
      setVerificationStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'verified':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'verified':
        return 'from-green-500 to-emerald-600';
      case 'failed':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-yellow-500 to-orange-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Blockchain Verification</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Blockchain Verification</h3>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getStatusColor()} text-white`}>
            {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
          </span>
        </div>
      </div>

      {/* Verification Details */}
      {record && (
        <div className="space-y-4">
          {/* Transaction Hash */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Transaction Hash</label>
              <button
                onClick={() => copyToClipboard(record.transactionHash)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <code className="text-sm font-mono text-gray-900 bg-white px-2 py-1 rounded border flex-1">
                {record.transactionHash}
              </code>
              <a
                href={record.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                title="View on Etherscan"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Block Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-medium text-gray-700 block mb-1">Block Number</label>
              <span className="text-lg font-semibold text-gray-900">#{record.blockNumber.toLocaleString()}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-medium text-gray-700 block mb-1">Timestamp</label>
              <span className="text-lg font-semibold text-gray-900">
                {new Date(record.timestamp).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Allocation Data */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-3">Verified Allocation Data</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Applicant ID:</span>
                <br />
                <code className="text-blue-900">{applicantId}</code>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Opportunity ID:</span>
                <br />
                <code className="text-blue-900">{opportunityId}</code>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Match Score:</span>
                <br />
                <span className="text-blue-900 font-semibold">{matchScore}%</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Gas Used:</span>
                <br />
                <span className="text-blue-900">{record.gasUsed?.toLocaleString() || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Verification Benefits */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-medium text-green-900 mb-3">Blockchain Benefits</h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-green-800">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Immutable Record</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Transparent Process</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Tamper Proof</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Publicly Verifiable</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Failed State */}
      {verificationStatus === 'failed' && (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Verification Failed</h4>
          <p className="text-gray-600 mb-4">
            Unable to verify this allocation on the blockchain. This may be due to network issues or the record not being mined yet.
          </p>
          <button
            onClick={fetchBlockchainRecord}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Verification
          </button>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          All internship allocations are permanently recorded on the Ethereum blockchain for transparency and accountability.
          This ensures fair and verifiable distribution of opportunities.
        </p>
      </div>
    </motion.div>
  );
}