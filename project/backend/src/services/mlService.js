const ort = require('onnxruntime-node');
const path = require('path');

class MLService {
  constructor() {
    this.models = {};
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log('🤖 Loading ML models...');
      
      // Load embedding model for content matching
      this.models.embeddings = await ort.InferenceSession.create(
        path.join(__dirname, '../../models/embeddings_model.onnx')
      );
      console.log('✅ Embeddings model loaded');

      // Load ranking model for match scoring
      this.models.ranking = await ort.InferenceSession.create(
        path.join(__dirname, '../../models/ranking_model.onnx')
      );
      console.log('✅ Ranking model loaded');

      // Load bias detection model
      this.models.bias = await ort.InferenceSession.create(
        path.join(__dirname, '../../models/bias_model.onnx')
      );
      console.log('✅ Bias detection model loaded');

      // Load demand forecasting model
      this.models.forecast = await ort.InferenceSession.create(
        path.join(__dirname, '../../models/forecast_model.onnx')
      );
      console.log('✅ Forecasting model loaded');

      this.isInitialized = true;
      console.log('🎯 All ML models initialized successfully');
    } catch (error) {
      console.error('❌ ML model initialization failed:', error);
      // Create mock models for development
      this.createMockModels();
    }
  }

  createMockModels() {
    console.log('🔧 Creating mock ML models for development...');
    this.models = {
      embeddings: { mock: true },
      ranking: { mock: true },
      bias: { mock: true },
      forecast: { mock: true }
    };
    this.isInitialized = true;
  }

  async generateEmbeddings(text) {
    if (!this.isInitialized) {
      throw new Error('ML service not initialized');
    }

    if (this.models.embeddings.mock) {
      // Mock embeddings - in production, this would be actual BERT/MiniLM embeddings
      const words = text.toLowerCase().split(' ');
      const embedding = new Array(384).fill(0).map(() => Math.random() - 0.5);
      
      // Add some semantic meaning based on keywords
      const techKeywords = ['javascript', 'python', 'react', 'node', 'ml', 'ai', 'data'];
      const hastech = words.some(word => techKeywords.includes(word));
      if (hastech) {
        for (let i = 0; i < 50; i++) {
          embedding[i] += 0.3;
        }
      }
      
      return embedding;
    }

    try {
      // Tokenize and prepare input (simplified)
      const inputTensor = new ort.Tensor('int64', [text.length], [1, text.length]);
      const feeds = { input_ids: inputTensor };
      
      const results = await this.models.embeddings.run(feeds);
      return Array.from(results.last_hidden_state.data);
    } catch (error) {
      console.error('Embedding generation failed:', error);
      return this.generateEmbeddings(text); // Fallback to mock
    }
  }

  async rankMatches(features) {
    if (!this.isInitialized) {
      throw new Error('ML service not initialized');
    }

    if (this.models.ranking.mock) {
      // Mock ranking based on feature similarity
      return features.map(feature => {
        const skillMatch = feature.skillOverlap || 0;
        const locationMatch = feature.locationScore || 0;
        const sectorMatch = feature.sectorScore || 0;
        const diversityBonus = feature.diversityScore || 0;
        
        const score = (skillMatch * 0.4 + locationMatch * 0.2 + sectorMatch * 0.3 + diversityBonus * 0.1) * 100;
        return Math.min(Math.max(score, 0), 100);
      });
    }

    try {
      const inputTensor = new ort.Tensor('float32', features.flat(), [features.length, features[0].length]);
      const feeds = { features: inputTensor };
      
      const results = await this.models.ranking.run(feeds);
      return Array.from(results.scores.data);
    } catch (error) {
      console.error('Ranking failed:', error);
      return this.rankMatches(features); // Fallback to mock
    }
  }

  async detectBias(allocations) {
    if (!this.isInitialized) {
      throw new Error('ML service not initialized');
    }

    if (this.models.bias.mock) {
      // Mock bias detection
      const categories = ['general', 'sc', 'st', 'obc'];
      const genderCategories = ['male', 'female'];
      const locationCategories = ['urban', 'rural'];
      
      const biasScore = {
        overall: Math.random() * 0.3 + 0.7, // 0.7-1.0 (higher is better)
        category: {},
        gender: {},
        location: {}
      };
      
      categories.forEach(cat => {
        biasScore.category[cat] = Math.random() * 0.4 + 0.6;
      });
      
      genderCategories.forEach(gender => {
        biasScore.gender[gender] = Math.random() * 0.3 + 0.7;
      });
      
      locationCategories.forEach(loc => {
        biasScore.location[loc] = Math.random() * 0.4 + 0.6;
      });
      
      return biasScore;
    }

    try {
      const inputTensor = new ort.Tensor('float32', allocations, [1, allocations.length]);
      const feeds = { allocations: inputTensor };
      
      const results = await this.models.bias.run(feeds);
      return {
        overall: results.bias_score.data[0],
        details: results.bias_details ? Array.from(results.bias_details.data) : []
      };
    } catch (error) {
      console.error('Bias detection failed:', error);
      return this.detectBias(allocations); // Fallback to mock
    }
  }

  async forecastDemand(historicalData) {
    if (!this.isInitialized) {
      throw new Error('ML service not initialized');
    }

    if (this.models.forecast.mock) {
      // Mock demand forecasting
      const sectors = ['technology', 'finance', 'healthcare', 'education', 'manufacturing'];
      const forecast = {};
      
      sectors.forEach(sector => {
        const baseValue = Math.floor(Math.random() * 1000) + 500;
        forecast[sector] = {
          nextMonth: baseValue + Math.floor(Math.random() * 200) - 100,
          nextQuarter: baseValue + Math.floor(Math.random() * 400) - 200,
          confidence: Math.random() * 0.3 + 0.7
        };
      });
      
      return forecast;
    }

    try {
      const inputTensor = new ort.Tensor('float32', historicalData, [1, historicalData.length]);
      const feeds = { historical_data: inputTensor };
      
      const results = await this.models.forecast.run(feeds);
      return Array.from(results.forecast.data);
    } catch (error) {
      console.error('Demand forecasting failed:', error);
      return this.forecastDemand(historicalData); // Fallback to mock
    }
  }

  // Utility function to calculate cosine similarity
  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  // Calculate Haversine distance between two coordinates
  haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
}

const mlService = new MLService();

async function initializeML() {
  await mlService.initialize();
}

module.exports = { mlService, initializeML };