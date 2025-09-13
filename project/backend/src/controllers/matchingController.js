const { matchingService } = require('../services/matchingService');
const { blockchainService } = require('../services/blockchainService');
const { addJob } = require('../services/queueService');
const { emitToUser } = require('../services/socketService');
const Application = require('../models/Application');
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');

class MatchingController {
  async runMatching(req, res) {
    try {
      const { batchSize = 1000, userId } = req.body;
      
      if (userId) {
        // Single user matching
        const matches = await matchingService.getMatchesForApplicant(userId);
        return res.json({
          success: true,
          matches,
          message: `Found ${matches.length} matches for user`
        });
      }

      // Batch matching - run as background job
      const job = await addJob('batch-matching', {
        batchSize,
        requestedBy: req.user.id,
        timestamp: new Date()
      });

      res.json({
        success: true,
        jobId: job.id,
        message: 'Batch matching started',
        estimatedTime: `${Math.ceil(batchSize / 200)} minutes`
      });

      // Emit progress updates via Socket.IO
      job.on('progress', (progress) => {
        emitToUser(req.user.id, 'matching-progress', { progress });
      });

    } catch (error) {
      console.error('Matching failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getMatches(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, minScore = 60 } = req.query;

      const matches = await matchingService.getMatchesForApplicant(userId);
      
      // Filter by minimum score
      const filteredMatches = matches.filter(match => match.score >= minScore);
      
      // Paginate
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedMatches = filteredMatches.slice(startIndex, endIndex);

      res.json({
        success: true,
        matches: paginatedMatches,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredMatches.length / limit),
          totalMatches: filteredMatches.length,
          hasNext: endIndex < filteredMatches.length,
          hasPrev: startIndex > 0
        }
      });

    } catch (error) {
      console.error('Failed to get matches:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async applyToOpportunity(req, res) {
    try {
      const { opportunityId, coverLetter } = req.body;
      const applicantId = req.user.id;

      // Check if already applied
      const existingApplication = await Application.findOne({
        applicant: applicantId,
        opportunity: opportunityId
      });

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          error: 'Already applied to this opportunity'
        });
      }

      // Get opportunity and check availability
      const opportunity = await Opportunity.findById(opportunityId);
      if (!opportunity) {
        return res.status(404).json({
          success: false,
          error: 'Opportunity not found'
        });
      }

      if (opportunity.slots.filled >= opportunity.slots.total) {
        return res.status(400).json({
          success: false,
          error: 'No slots available'
        });
      }

      // Get applicant details
      const applicant = await User.findById(applicantId);
      
      // Calculate match score
      const matches = await matchingService.getMatchesForApplicant(applicantId);
      const matchData = matches.find(m => m.opportunity._id.toString() === opportunityId);
      
      // Create application
      const application = new Application({
        applicant: applicantId,
        opportunity: opportunityId,
        coverLetter,
        matchScore: matchData?.score || 0,
        matchExplanation: matchData?.explanation || [],
        diversityCategory: applicant.socialCategory,
        priorityScore: this.calculatePriorityScore(applicant)
      });

      await application.save();

      // Update opportunity application count
      await Opportunity.findByIdAndUpdate(opportunityId, {
        $inc: { applications: 1 }
      });

      // Record on blockchain
      try {
        const blockchainRecord = await blockchainService.recordAllocation({
          applicantId: applicantId,
          opportunityId: opportunityId,
          matchScore: application.matchScore,
          timestamp: Date.now()
        });

        application.blockchainRecord = blockchainRecord;
        await application.save();
      } catch (blockchainError) {
        console.error('Blockchain recording failed:', blockchainError);
        // Continue without blockchain record
      }

      // Award points for application
      await User.findByIdAndUpdate(applicantId, {
        $inc: { points: 10 }
      });

      // Emit real-time notification
      emitToUser(opportunity.recruiter, 'new-application', {
        applicant: applicant.name,
        opportunity: opportunity.title,
        matchScore: application.matchScore
      });

      res.json({
        success: true,
        application: await application.populate(['opportunity', 'applicant']),
        message: 'Application submitted successfully'
      });

    } catch (error) {
      console.error('Application failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getApplications(req, res) {
    try {
      const userId = req.user.id;
      const { status, page = 1, limit = 10 } = req.query;

      const query = { applicant: userId };
      if (status) query.status = status;

      const applications = await Application.find(query)
        .populate('opportunity', 'title company sector location stipend')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Application.countDocuments(query);

      res.json({
        success: true,
        applications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalApplications: total
        }
      });

    } catch (error) {
      console.error('Failed to get applications:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async withdrawApplication(req, res) {
    try {
      const { applicationId } = req.params;
      const userId = req.user.id;

      const application = await Application.findOne({
        _id: applicationId,
        applicant: userId
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          error: 'Application not found'
        });
      }

      if (['selected', 'rejected'].includes(application.status)) {
        return res.status(400).json({
          success: false,
          error: 'Cannot withdraw application at this stage'
        });
      }

      application.status = 'withdrawn';
      await application.save();

      // Update opportunity application count
      await Opportunity.findByIdAndUpdate(application.opportunity, {
        $inc: { applications: -1 }
      });

      res.json({
        success: true,
        message: 'Application withdrawn successfully'
      });

    } catch (error) {
      console.error('Failed to withdraw application:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getMatchingStats(req, res) {
    try {
      const stats = await matchingService.generateMatchingReport();
      
      res.json({
        success: true,
        stats
      });

    } catch (error) {
      console.error('Failed to get matching stats:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  calculatePriorityScore(applicant) {
    let score = 0;
    
    // Social category priority
    if (applicant.socialCategory === 'st') score += 30;
    else if (applicant.socialCategory === 'sc') score += 25;
    else if (applicant.socialCategory === 'obc') score += 15;
    
    // Location priority
    if (applicant.location?.isAspirational) score += 25;
    else if (applicant.location?.isRural) score += 15;
    
    // Disability priority
    if (applicant.isPwD) score += 20;
    
    // Profile completion bonus
    score += (applicant.profileCompletion / 100) * 10;
    
    return Math.min(score, 100);
  }
}

module.exports = new MatchingController();