const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { ocrService } = require('../services/ocrService');
const User = require('../models/User');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/documents');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG) and PDF files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

class DocumentController {
  // Upload and verify document
  async uploadDocument(req, res) {
    try {
      const { documentType } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      if (!documentType || !['pan', 'aadhaar', 'marksMemo'].includes(documentType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid document type'
        });
      }

      console.log(`📄 Processing ${documentType} document for user ${req.user.id}`);

      // Perform OCR validation
      const validationResult = await ocrService.validateDocument(documentType, file.path);

      // Update user document record
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Update document in user record
      const documentRecord = {
        type: documentType,
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        verified: validationResult.valid,
        ocrData: validationResult,
        uploadedAt: new Date()
      };

      // Remove existing document of same type
      user.documents = user.documents.filter(doc => doc.type !== documentType);
      user.documents.push(documentRecord);

      await user.save();

      // Clean up file if validation failed
      if (!validationResult.valid) {
        try {
          await fs.unlink(file.path);
        } catch (cleanupError) {
          console.error('Failed to cleanup invalid file:', cleanupError);
        }
      }

      res.json({
        success: true,
        document: {
          type: documentType,
          filename: file.filename,
          verified: validationResult.valid,
          validationScore: validationResult.validationScore,
          extractedData: this.sanitizeExtractedData(documentType, validationResult)
        },
        message: validationResult.valid 
          ? 'Document uploaded and verified successfully'
          : `Document validation failed: ${validationResult.error}`
      });

    } catch (error) {
      console.error('Document upload failed:', error);
      
      // Clean up uploaded file on error
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (cleanupError) {
          console.error('Failed to cleanup file on error:', cleanupError);
        }
      }

      res.status(500).json({
        success: false,
        error: error.message || 'Document upload failed'
      });
    }
  }

  // Get user documents
  async getDocuments(req, res) {
    try {
      const user = await User.findById(req.user.id).select('documents');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const documents = user.documents.map(doc => ({
        type: doc.type,
        filename: doc.filename,
        originalName: doc.originalName,
        verified: doc.verified,
        uploadedAt: doc.uploadedAt,
        validationScore: doc.ocrData?.validationScore,
        extractedData: this.sanitizeExtractedData(doc.type, doc.ocrData)
      }));

      res.json({
        success: true,
        documents
      });

    } catch (error) {
      console.error('Failed to get documents:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Delete document
  async deleteDocument(req, res) {
    try {
      const { documentType } = req.params;
      
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const documentIndex = user.documents.findIndex(doc => doc.type === documentType);
      if (documentIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Document not found'
        });
      }

      const document = user.documents[documentIndex];
      
      // Delete file from filesystem
      try {
        await fs.unlink(document.path);
      } catch (fileError) {
        console.error('Failed to delete file:', fileError);
      }

      // Remove from user record
      user.documents.splice(documentIndex, 1);
      await user.save();

      res.json({
        success: true,
        message: 'Document deleted successfully'
      });

    } catch (error) {
      console.error('Failed to delete document:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Re-verify document
  async reverifyDocument(req, res) {
    try {
      const { documentType } = req.params;
      
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const document = user.documents.find(doc => doc.type === documentType);
      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found'
        });
      }

      // Check if file still exists
      try {
        await fs.access(document.path);
      } catch (error) {
        return res.status(404).json({
          success: false,
          error: 'Document file not found on server'
        });
      }

      // Re-run OCR validation
      const validationResult = await ocrService.validateDocument(documentType, document.path);
      
      // Update document record
      document.verified = validationResult.valid;
      document.ocrData = validationResult;
      
      await user.save();

      res.json({
        success: true,
        document: {
          type: documentType,
          verified: validationResult.valid,
          validationScore: validationResult.validationScore,
          extractedData: this.sanitizeExtractedData(documentType, validationResult)
        },
        message: validationResult.valid 
          ? 'Document re-verified successfully'
          : `Document validation failed: ${validationResult.error}`
      });

    } catch (error) {
      console.error('Document re-verification failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get document verification statistics (admin only)
  async getVerificationStats(req, res) {
    try {
      const stats = await User.aggregate([
        { $unwind: '$documents' },
        {
          $group: {
            _id: {
              type: '$documents.type',
              verified: '$documents.verified'
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: '$_id.type',
            total: { $sum: '$count' },
            verified: {
              $sum: {
                $cond: [{ $eq: ['$_id.verified', true] }, '$count', 0]
              }
            },
            unverified: {
              $sum: {
                $cond: [{ $eq: ['$_id.verified', false] }, '$count', 0]
              }
            }
          }
        }
      ]);

      const formattedStats = {
        total: 0,
        byType: {},
        overallVerificationRate: 0
      };

      let totalDocuments = 0;
      let totalVerified = 0;

      stats.forEach(stat => {
        formattedStats.byType[stat._id] = {
          total: stat.total,
          verified: stat.verified,
          unverified: stat.unverified,
          verificationRate: ((stat.verified / stat.total) * 100).toFixed(1)
        };
        
        totalDocuments += stat.total;
        totalVerified += stat.verified;
      });

      formattedStats.total = totalDocuments;
      formattedStats.overallVerificationRate = totalDocuments > 0 
        ? ((totalVerified / totalDocuments) * 100).toFixed(1)
        : 0;

      res.json({
        success: true,
        stats: formattedStats
      });

    } catch (error) {
      console.error('Failed to get verification stats:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Sanitize extracted data for client response
  sanitizeExtractedData(documentType, ocrData) {
    if (!ocrData || !ocrData.valid) {
      return null;
    }

    switch (documentType) {
      case 'pan':
        return {
          panNumber: ocrData.panNumber,
          confidence: ocrData.confidence
        };
      case 'aadhaar':
        return {
          name: ocrData.name,
          dob: ocrData.dob,
          confidence: ocrData.confidence
        };
      case 'marksMemo':
        return {
          studentName: ocrData.studentName,
          grades: ocrData.grades,
          confidence: ocrData.confidence
        };
      default:
        return null;
    }
  }
}

const documentController = new DocumentController();

// Export multer upload middleware and controller
module.exports = {
  upload: upload.single('document'),
  documentController
};