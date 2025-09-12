const express = require('express');
const { body, query } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const matchingController = require('../controllers/matchingController');

const router = express.Router();

// Run matching algorithm
router.post('/run',
  auth,
  body('batchSize').optional().isInt({ min: 1, max: 10000 }),
  body('userId').optional().isMongoId(),
  validate,
  matchingController.runMatching
);

// Get matches for current user
router.get('/matches',
  auth,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('minScore').optional().isInt({ min: 0, max: 100 }),
  validate,
  matchingController.getMatches
);

// Apply to opportunity
router.post('/apply',
  auth,
  body('opportunityId').isMongoId(),
  body('coverLetter').optional().isLength({ max: 1000 }),
  validate,
  matchingController.applyToOpportunity
);

// Get user's applications
router.get('/applications',
  auth,
  query('status').optional().isIn(['applied', 'under_review', 'shortlisted', 'interview_scheduled', 'selected', 'rejected', 'withdrawn']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  validate,
  matchingController.getApplications
);

// Withdraw application
router.patch('/applications/:applicationId/withdraw',
  auth,
  matchingController.withdrawApplication
);

// Get matching statistics (admin only)
router.get('/stats',
  auth,
  (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    next();
  },
  matchingController.getMatchingStats
);

module.exports = router;