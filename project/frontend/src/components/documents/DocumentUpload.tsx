import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, CheckCircle, AlertCircle, X, Eye, Download, RefreshCw } from 'lucide-react';

interface Document {
  type: string;
  filename: string;
  originalName: string;
  verified: boolean;
  uploadedAt: string;
  validationScore?: number;
  extractedData?: any;
}

interface DocumentUploadProps {
  onUploadComplete?: (document: Document) => void;
  allowedTypes?: string[];
  maxSize?: number;
}

export default function DocumentUpload({ 
  onUploadComplete, 
  allowedTypes = ['pan', 'aadhaar', 'marksMemo'],
  maxSize = 10 * 1024 * 1024 // 10MB
}: DocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [error, setError] = useState<string | null>(null);

  const documentTypes = {
    pan: { label: 'PAN Card', icon: '🆔', description: 'Upload your PAN card for identity verification' },
    aadhaar: { label: 'Aadhaar Card', icon: '🏛️', description: 'Upload your Aadhaar card for address verification' },
    marksMemo: { label: 'Marks Memo', icon: '📜', description: 'Upload your academic transcripts or marks memo' }
  };

  React.useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  const handleFileSelect = useCallback(async (file: File, documentType: string) => {
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      setError('Only JPG, PNG, and PDF files are allowed');
      return;
    }

    setUploading(documentType);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchDocuments();
        if (onUploadComplete) {
          onUploadComplete(data.document);
        }
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (error: any) {
      setError(error.message || 'Upload failed');
    } finally {
      setUploading(null);
    }
  }, [maxSize, onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent, documentType: string) => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0], documentType);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent, documentType: string) => {
    e.preventDefault();
    setDragOver(documentType);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  }, []);

  const reverifyDocument = async (documentType: string) => {
    setUploading(documentType);
    try {
      const response = await fetch(`/api/documents/${documentType}/reverify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        await fetchDocuments();
      } else {
        setError(data.error);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(null);
    }
  };

  const deleteDocument = async (documentType: string) => {
    try {
      const response = await fetch(`/api/documents/${documentType}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        await fetchDocuments();
      } else {
        setError(data.error);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const getDocumentByType = (type: string) => {
    return documents.find(doc => doc.type === type);
  };

  const renderDocumentCard = (type: string) => {
    const docType = documentTypes[type as keyof typeof documentTypes];
    const document = getDocumentByType(type);
    const isUploading = uploading === type;
    const isDragOver = dragOver === type;

    return (
      <motion.div
        key={type}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : document?.verified 
            ? 'border-green-300 bg-green-50' 
            : document && !document.verified
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={(e) => handleDrop(e, type)}
        onDragOver={(e) => handleDragOver(e, type)}
        onDragLeave={handleDragLeave}
      >
        {/* Upload Area */}
        {!document && (
          <div className="text-center">
            <div className="text-4xl mb-4">{docType.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{docType.label}</h3>
            <p className="text-sm text-gray-600 mb-4">{docType.description}</p>
            
            {isUploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-blue-600">Processing...</span>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file, type);
                  }}
                  className="hidden"
                  id={`file-${type}`}
                />
                <label
                  htmlFor={`file-${type}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  or drag and drop your file here
                </p>
              </>
            )}
          </div>
        )}

        {/* Document Info */}
        {document && (
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{docType.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{docType.label}</h3>
                  <p className="text-sm text-gray-600">{document.originalName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {document.verified ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>

            {/* Verification Status */}
            <div className={`p-3 rounded-lg mb-4 ${
              document.verified ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  document.verified ? 'text-green-800' : 'text-red-800'
                }`}>
                  {document.verified ? 'Verified' : 'Verification Failed'}
                </span>
                {document.validationScore && (
                  <span className="text-sm text-gray-600">
                    Score: {document.validationScore}%
                  </span>
                )}
              </div>
            </div>

            {/* Extracted Data */}
            {document.extractedData && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Extracted Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {type === 'pan' && document.extractedData.panNumber && (
                    <p>PAN: {document.extractedData.panNumber}</p>
                  )}
                  {type === 'aadhaar' && (
                    <>
                      {document.extractedData.name && <p>Name: {document.extractedData.name}</p>}
                      {document.extractedData.dob && <p>DOB: {document.extractedData.dob}</p>}
                    </>
                  )}
                  {type === 'marksMemo' && (
                    <>
                      {document.extractedData.studentName && <p>Student: {document.extractedData.studentName}</p>}
                      {document.extractedData.grades && (
                        <p>Grades: {document.extractedData.grades.slice(0, 3).join(', ')}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedDocument(document)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
              
              <button
                onClick={() => reverifyDocument(type)}
                disabled={isUploading}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isUploading ? 'animate-spin' : ''}`} />
                <span>Re-verify</span>
              </button>
              
              <button
                onClick={() => deleteDocument(type)}
                className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Upload Error</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-red-600 hover:text-red-700 text-sm underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allowedTypes.map(type => renderDocumentCard(type))}
      </div>

      {/* Progress Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Document Verification Progress</h3>
        <div className="space-y-2">
          {allowedTypes.map(type => {
            const document = getDocumentByType(type);
            const docType = documentTypes[type as keyof typeof documentTypes];
            
            return (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{docType.label}</span>
                <div className="flex items-center space-x-2">
                  {document ? (
                    document.verified ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  )}
                  <span className="text-sm text-gray-500">
                    {document ? (document.verified ? 'Verified' : 'Failed') : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">Overall Progress</span>
            <span className="text-sm text-gray-600">
              {documents.filter(d => d.verified).length} of {allowedTypes.length} verified
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(documents.filter(d => d.verified).length / allowedTypes.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {selectedDocument && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedDocument(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {documentTypes[selectedDocument.type as keyof typeof documentTypes]?.label}
                  </h3>
                  <button
                    onClick={() => setSelectedDocument(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Filename: {selectedDocument.originalName}</p>
                    <p className="text-sm text-gray-600">
                      Uploaded: {new Date(selectedDocument.uploadedAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {selectedDocument.verified ? 'Verified' : 'Verification Failed'}
                    </p>
                    {selectedDocument.validationScore && (
                      <p className="text-sm text-gray-600">
                        Validation Score: {selectedDocument.validationScore}%
                      </p>
                    )}
                  </div>

                  {selectedDocument.extractedData && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Extracted Data</h4>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(selectedDocument.extractedData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}