const express = require('express');
const auth = require('../middleware/auth');
const { geospatialService } = require('../services/geospatialService');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

const router = express.Router();

// Get geographic insights for opportunities
router.get('/insights', auth, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ status: 'active' });
    const insights = geospatialService.generateGeographicInsights(opportunities);
    
    res.json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('Failed to generate geographic insights:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get location recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ status: 'active' });
    const recommendations = geospatialService.getLocationRecommendations(opportunities);
    
    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Failed to get location recommendations:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Calculate geographic diversity score
router.get('/diversity-score', auth, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ status: 'active' });
    const diversityScore = geospatialService.calculateDiversityScore(opportunities);
    
    res.json({
      success: true,
      diversityScore
    });
  } catch (error) {
    console.error('Failed to calculate diversity score:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get aspirational districts
router.get('/aspirational-districts', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      districts: geospatialService.aspirationalDistricts
    });
  } catch (error) {
    console.error('Failed to get aspirational districts:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Check if location is aspirational
router.post('/check-aspirational', auth, async (req, res) => {
  try {
    const { district, state } = req.body;
    
    if (!district || !state) {
      return res.status(400).json({
        success: false,
        error: 'District and state are required'
      });
    }

    const isAspirational = geospatialService.isAspirationalDistrict(district, state);
    
    res.json({
      success: true,
      isAspirational,
      district,
      state
    });
  } catch (error) {
    console.error('Failed to check aspirational status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Classify location as rural/urban
router.post('/classify-location', auth, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    const classification = geospatialService.classifyLocation(latitude, longitude);
    const nearestAspirational = geospatialService.getNearestAspirationalDistrict(latitude, longitude);
    
    res.json({
      success: true,
      classification,
      nearestAspirational
    });
  } catch (error) {
    console.error('Failed to classify location:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user distribution map data
router.get('/user-distribution', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const users = await User.aggregate([
      {
        $match: {
          'location.coordinates': { $exists: true },
          'location.state': { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            state: '$location.state',
            district: '$location.district',
            isRural: '$location.isRural',
            isAspirational: '$location.isAspirational'
          },
          count: { $sum: 1 },
          roles: { $push: '$role' },
          coordinates: { $first: '$location.coordinates' }
        }
      }
    ]);

    const distributionData = users.map(item => ({
      state: item._id.state,
      district: item._id.district,
      coordinates: item.coordinates,
      userCount: item.count,
      isRural: item._id.isRural,
      isAspirational: item._id.isAspirational,
      roleDistribution: item.roles.reduce((acc, role) => {
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {})
    }));

    res.json({
      success: true,
      distributionData,
      summary: {
        totalLocations: users.length,
        totalUsers: users.reduce((sum, item) => sum + item.count, 0),
        ruralLocations: users.filter(item => item._id.isRural).length,
        aspirationalLocations: users.filter(item => item._id.isAspirational).length
      }
    });

  } catch (error) {
    console.error('Failed to get user distribution:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Perform DBSCAN clustering on opportunities
router.get('/opportunity-clusters', auth, async (req, res) => {
  try {
    const { epsilon = 50, minPoints = 3 } = req.query;
    
    const opportunities = await Opportunity.find({
      status: 'active',
      'location.coordinates': { $exists: true }
    }).select('title company location');

    const points = opportunities.map(opp => ({
      id: opp._id,
      coordinates: opp.location.coordinates,
      title: opp.title,
      company: opp.company,
      state: opp.location.state,
      district: opp.location.district
    }));

    const clusters = geospatialService.dbscanClustering(points, parseFloat(epsilon), parseInt(minPoints));
    
    res.json({
      success: true,
      clusters,
      parameters: {
        epsilon: parseFloat(epsilon),
        minPoints: parseInt(minPoints)
      },
      summary: {
        totalOpportunities: points.length,
        clustersFound: clusters.length,
        noisePoints: points.filter(p => p.cluster === -1).length
      }
    });

  } catch (error) {
    console.error('Failed to perform clustering:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;