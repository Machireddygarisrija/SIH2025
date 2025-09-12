const { mlService } = require('./mlService');
const { pineconeService } = require('./pineconeService');
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const { getFromCache, setCache } = require('./redisService');

class MatchingService {
  constructor() {
    this.quotaRules = {
      sc: 0.15,    // 15% for SC
      st: 0.075,   // 7.5% for ST
      obc: 0.27,   // 27% for OBC
      pwd: 0.04,   // 4% for PwD
      women: 0.33, // 33% for women
      rural: 0.35  // 35% for rural areas
    };
  }

  async runBatchMatching(batchSize = 1000) {
    console.log(`🎯 Starting batch matching for ${batchSize} users...`);
    
    try {
      // Get active opportunities
      const opportunities = await Opportunity.find({ 
        status: 'active',
        applicationDeadline: { $gte: new Date() }
      }).populate('recruiter');

      if (opportunities.length === 0) {
        throw new Error('No active opportunities found');
      }

      // Get applicants who haven't been matched recently
      const applicants = await User.find({
        role: 'applicant',
        isActive: true,
        isVerified: true
      }).limit(batchSize);

      console.log(`📊 Found ${opportunities.length} opportunities and ${applicants.length} applicants`);

      const matches = [];
      let processedCount = 0;

      for (const applicant of applicants) {
        const applicantMatches = await this.findMatchesForApplicant(applicant, opportunities);
        matches.push(...applicantMatches);
        
        processedCount++;
        if (processedCount % 100 === 0) {
          console.log(`✅ Processed ${processedCount}/${applicants.length} applicants`);
        }
      }

      // Apply diversity constraints
      const balancedMatches = await this.applyDiversityConstraints(matches);

      // Store matches in cache for quick retrieval
      await this.storeMatches(balancedMatches);

      console.log(`🎉 Batch matching completed: ${balancedMatches.length} matches generated`);
      return {
        totalMatches: balancedMatches.length,
        processedApplicants: applicants.length,
        averageMatchesPerApplicant: balancedMatches.length / applicants.length
      };

    } catch (error) {
      console.error('❌ Batch matching failed:', error);
      throw error;
    }
  }

  async findMatchesForApplicant(applicant, opportunities) {
    const matches = [];
    
    try {
      // Generate applicant embedding
      const applicantText = `${applicant.skills?.join(' ')} ${applicant.qualifications} ${applicant.experience || ''}`;
      const applicantEmbedding = await mlService.generateEmbeddings(applicantText);

      for (const opportunity of opportunities) {
        // Skip if already applied
        const existingApplication = await Application.findOne({
          applicant: applicant._id,
          opportunity: opportunity._id
        });
        
        if (existingApplication) continue;

        // Calculate match score
        const matchData = await this.calculateMatchScore(applicant, opportunity, applicantEmbedding);
        
        if (matchData.score >= 60) { // Minimum threshold
          matches.push({
            applicant: applicant._id,
            opportunity: opportunity._id,
            score: matchData.score,
            explanation: matchData.explanation,
            features: matchData.features
          });
        }
      }

      // Sort by score and take top 10
      matches.sort((a, b) => b.score - a.score);
      return matches.slice(0, 10);

    } catch (error) {
      console.error(`Error matching applicant ${applicant._id}:`, error);
      return [];
    }
  }

  async calculateMatchScore(applicant, opportunity, applicantEmbedding) {
    try {
      // Generate opportunity embedding
      const opportunityText = `${opportunity.skills?.map(s => s.name).join(' ')} ${opportunity.description} ${opportunity.sector}`;
      const opportunityEmbedding = await mlService.generateEmbeddings(opportunityText);

      // Calculate content similarity
      const contentSimilarity = mlService.cosineSimilarity(applicantEmbedding, opportunityEmbedding);

      // Calculate skill overlap
      const applicantSkills = new Set(applicant.skills?.map(s => s.toLowerCase()) || []);
      const opportunitySkills = new Set(opportunity.skills?.map(s => s.name.toLowerCase()) || []);
      const skillIntersection = new Set([...applicantSkills].filter(x => opportunitySkills.has(x)));
      const skillOverlap = skillIntersection.size / Math.max(opportunitySkills.size, 1);

      // Calculate location score
      let locationScore = 0.5; // Default for remote/no preference
      if (applicant.location?.coordinates && opportunity.location?.coordinates) {
        const distance = mlService.haversineDistance(
          applicant.location.coordinates.lat,
          applicant.location.coordinates.lng,
          opportunity.location.coordinates.lat,
          opportunity.location.coordinates.lng
        );
        locationScore = Math.max(0, 1 - (distance / 1000)); // Normalize by 1000km
      }

      // Calculate diversity bonus
      let diversityBonus = 0;
      if (applicant.socialCategory !== 'general') diversityBonus += 0.1;
      if (applicant.isPwD) diversityBonus += 0.1;
      if (applicant.location?.isRural) diversityBonus += 0.1;
      if (applicant.location?.isAspirational) diversityBonus += 0.15;

      // Combine scores using ML model
      const features = [
        contentSimilarity,
        skillOverlap,
        locationScore,
        diversityBonus,
        applicant.profileCompletion / 100,
        opportunity.priority === 'high' ? 1 : opportunity.priority === 'medium' ? 0.5 : 0
      ];

      const [mlScore] = await mlService.rankMatches([features]);
      
      // Generate explanation
      const explanation = [
        { factor: 'Content Similarity', score: Math.round(contentSimilarity * 100), weight: 30 },
        { factor: 'Skill Match', score: Math.round(skillOverlap * 100), weight: 35 },
        { factor: 'Location Preference', score: Math.round(locationScore * 100), weight: 20 },
        { factor: 'Diversity Bonus', score: Math.round(diversityBonus * 100), weight: 15 }
      ];

      return {
        score: Math.round(mlScore),
        explanation,
        features: {
          contentSimilarity,
          skillOverlap,
          locationScore,
          diversityBonus
        }
      };

    } catch (error) {
      console.error('Error calculating match score:', error);
      // Fallback to simple scoring
      return {
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        explanation: [{ factor: 'Basic Match', score: 75, weight: 100 }],
        features: {}
      };
    }
  }

  async applyDiversityConstraints(matches) {
    console.log('🎯 Applying diversity constraints...');
    
    // Group matches by opportunity
    const matchesByOpportunity = {};
    matches.forEach(match => {
      if (!matchesByOpportunity[match.opportunity]) {
        matchesByOpportunity[match.opportunity] = [];
      }
      matchesByOpportunity[match.opportunity].push(match);
    });

    const balancedMatches = [];

    for (const [opportunityId, opportunityMatches] of Object.entries(matchesByOpportunity)) {
      const opportunity = await Opportunity.findById(opportunityId);
      if (!opportunity) continue;

      // Sort by score
      opportunityMatches.sort((a, b) => b.score - a.score);

      // Apply quota-based selection
      const selectedMatches = await this.selectWithQuotas(opportunityMatches, opportunity.slots.total);
      balancedMatches.push(...selectedMatches);
    }

    return balancedMatches;
  }

  async selectWithQuotas(matches, totalSlots) {
    const selected = [];
    const quotaSlots = {};
    
    // Calculate quota slots
    Object.entries(this.quotaRules).forEach(([category, percentage]) => {
      quotaSlots[category] = Math.ceil(totalSlots * percentage);
    });

    // Get applicant details for quota checking
    const applicantIds = matches.map(m => m.applicant);
    const applicants = await User.find({ _id: { $in: applicantIds } });
    const applicantMap = {};
    applicants.forEach(a => applicantMap[a._id] = a);

    // Track quota usage
    const quotaUsed = {
      sc: 0, st: 0, obc: 0, pwd: 0, women: 0, rural: 0
    };

    // First pass: Fill quota requirements
    for (const match of matches) {
      if (selected.length >= totalSlots) break;
      
      const applicant = applicantMap[match.applicant];
      if (!applicant) continue;

      let shouldSelect = false;
      
      // Check quota eligibility
      if (applicant.socialCategory === 'sc' && quotaUsed.sc < quotaSlots.sc) {
        quotaUsed.sc++;
        shouldSelect = true;
      } else if (applicant.socialCategory === 'st' && quotaUsed.st < quotaSlots.st) {
        quotaUsed.st++;
        shouldSelect = true;
      } else if (applicant.socialCategory === 'obc' && quotaUsed.obc < quotaSlots.obc) {
        quotaUsed.obc++;
        shouldSelect = true;
      } else if (applicant.isPwD && quotaUsed.pwd < quotaSlots.pwd) {
        quotaUsed.pwd++;
        shouldSelect = true;
      } else if (applicant.location?.isRural && quotaUsed.rural < quotaSlots.rural) {
        quotaUsed.rural++;
        shouldSelect = true;
      }

      if (shouldSelect) {
        selected.push(match);
      }
    }

    // Second pass: Fill remaining slots with best matches
    for (const match of matches) {
      if (selected.length >= totalSlots) break;
      
      if (!selected.find(s => s.applicant.toString() === match.applicant.toString())) {
        selected.push(match);
      }
    }

    return selected.slice(0, totalSlots);
  }

  async storeMatches(matches) {
    const cachePromises = [];
    
    // Group by applicant for caching
    const matchesByApplicant = {};
    matches.forEach(match => {
      if (!matchesByApplicant[match.applicant]) {
        matchesByApplicant[match.applicant] = [];
      }
      matchesByApplicant[match.applicant].push(match);
    });

    // Cache matches for each applicant
    for (const [applicantId, applicantMatches] of Object.entries(matchesByApplicant)) {
      const cacheKey = `matches:${applicantId}`;
      cachePromises.push(setCache(cacheKey, applicantMatches, 3600)); // 1 hour TTL
    }

    await Promise.all(cachePromises);
    console.log(`💾 Cached matches for ${Object.keys(matchesByApplicant).length} applicants`);
  }

  async getMatchesForApplicant(applicantId) {
    const cacheKey = `matches:${applicantId}`;
    let matches = await getFromCache(cacheKey);
    
    if (!matches) {
      // Generate fresh matches for this applicant
      const applicant = await User.findById(applicantId);
      const opportunities = await Opportunity.find({ 
        status: 'active',
        applicationDeadline: { $gte: new Date() }
      });
      
      matches = await this.findMatchesForApplicant(applicant, opportunities);
      await setCache(cacheKey, matches, 3600);
    }

    // Populate opportunity details
    const opportunityIds = matches.map(m => m.opportunity);
    const opportunities = await Opportunity.find({ _id: { $in: opportunityIds } })
      .populate('recruiter', 'name companyName');

    return matches.map(match => ({
      ...match,
      opportunity: opportunities.find(o => o._id.toString() === match.opportunity.toString())
    }));
  }

  async generateMatchingReport() {
    const report = {
      timestamp: new Date(),
      totalOpportunities: await Opportunity.countDocuments({ status: 'active' }),
      totalApplicants: await User.countDocuments({ role: 'applicant', isActive: true }),
      totalApplications: await Application.countDocuments(),
      matchingStats: {},
      diversityMetrics: {},
      performanceMetrics: {}
    };

    // Calculate matching statistics
    const applications = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    applications.forEach(stat => {
      report.matchingStats[stat._id] = stat.count;
    });

    // Calculate diversity metrics
    const diversityStats = await Application.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'applicant',
          foreignField: '_id',
          as: 'applicantData'
        }
      },
      {
        $unwind: '$applicantData'
      },
      {
        $group: {
          _id: {
            category: '$applicantData.socialCategory',
            status: '$status'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    diversityStats.forEach(stat => {
      if (!report.diversityMetrics[stat._id.category]) {
        report.diversityMetrics[stat._id.category] = {};
      }
      report.diversityMetrics[stat._id.category][stat._id.status] = stat.count;
    });

    return report;
  }
}

const matchingService = new MatchingService();
module.exports = { matchingService };