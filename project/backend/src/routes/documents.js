const express = require('express');
const auth = require('../middleware/auth');
const { upload, documentController } = require('../controllers/documentController');

const router = express.Router();

// Upload document with OCR validation
router.post('/upload', auth, upload, documentController.uploadDocument);

// Get user documents
router.get('/', auth, documentController.getDocuments);

// Delete document
router.delete('/:documentType', auth, documentController.deleteDocument);

// Re-verify document
router.post('/:documentType/reverify', auth, documentController.reverifyDocument);

// Get verification statistics (admin only)
router.get('/stats', auth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
}, documentController.getVerificationStats);

module.exports = router;