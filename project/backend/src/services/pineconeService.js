const { Pinecone } = require('@pinecone-database/pinecone');

class PineconeService {
  constructor() {
    this.client = null;
    this.index = null;
    this.isInitialized = false;
    this.indexName = 'pm-internship-embeddings';
  }

  async initialize() {
    try {
      console.log('🔍 Initializing Pinecone service...');
      
      if (!process.env.PINECONE_API_KEY) {
        console.log('🔧 Pinecone API key not found, using mock service');
        this.isInitialized = true;
        return;
      }

      this.client = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
      });

      // Check if index exists, create if not
      const indexList = await this.client.listIndexes();
      const indexExists = indexList.indexes?.some(index => index.name === this.indexName);

      if (!indexExists) {
        console.log(`Creating Pinecone index: ${this.indexName}`);
        await this.client.createIndex({
          name: this.indexName,
          dimension: 384, // MiniLM embedding dimension
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-east-1'
            }
          }
        });

        // Wait for index to be ready
        await this.waitForIndexReady();
      }

      this.index = this.client.index(this.indexName);
      this.isInitialized = true;
      console.log('✅ Pinecone service initialized');

    } catch (error) {
      console.error('❌ Pinecone initialization failed:', error);
      console.log('🔧 Falling back to mock service');
      this.isInitialized = true; // Continue with mock service
    }
  }

  async waitForIndexReady() {
    let ready = false;
    let attempts = 0;
    const maxAttempts = 30;

    while (!ready && attempts < maxAttempts) {
      try {
        const indexStats = await this.client.describeIndex(this.indexName);
        ready = indexStats.status?.ready;
        
        if (!ready) {
          console.log(`Waiting for index to be ready... (${attempts + 1}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error('Error checking index status:', error);
      }
      attempts++;
    }

    if (!ready) {
      throw new Error('Index failed to become ready within timeout');
    }
  }

  async upsertEmbeddings(vectors) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.index) {
      // Mock implementation
      console.log(`🔧 Mock: Upserting ${vectors.length} vectors`);
      return { upsertedCount: vectors.length };
    }

    try {
      const response = await this.index.upsert(vectors);
      console.log(`📊 Upserted ${vectors.length} vectors to Pinecone`);
      return response;
    } catch (error) {
      console.error('Failed to upsert vectors:', error);
      throw error;
    }
  }

  async queryEmbeddings(vector, topK = 10, filter = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.index) {
      // Mock implementation
      console.log(`🔧 Mock: Querying for top ${topK} similar vectors`);
      return {
        matches: Array.from({ length: Math.min(topK, 5) }, (_, i) => ({
          id: `mock-${i}`,
          score: 0.9 - (i * 0.1),
          metadata: {
            type: 'opportunity',
            title: `Mock Opportunity ${i + 1}`,
            company: `Mock Company ${i + 1}`,
            skills: ['JavaScript', 'React', 'Node.js']
          }
        }))
      };
    }

    try {
      const queryRequest = {
        vector,
        topK,
        includeMetadata: true,
        includeValues: false
      };

      if (Object.keys(filter).length > 0) {
        queryRequest.filter = filter;
      }

      const response = await this.index.query(queryRequest);
      return response;
    } catch (error) {
      console.error('Failed to query vectors:', error);
      throw error;
    }
  }

  async deleteVectors(ids) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.index) {
      console.log(`🔧 Mock: Deleting vectors with ids: ${ids.join(', ')}`);
      return { deletedCount: ids.length };
    }

    try {
      await this.index.deleteOne(ids);
      console.log(`🗑️ Deleted vectors: ${ids.join(', ')}`);
      return { deletedCount: ids.length };
    } catch (error) {
      console.error('Failed to delete vectors:', error);
      throw error;
    }
  }

  async updateOpportunityEmbedding(opportunityId, embedding, metadata) {
    const vector = {
      id: `opportunity-${opportunityId}`,
      values: embedding,
      metadata: {
        type: 'opportunity',
        opportunityId,
        ...metadata
      }
    };

    return await this.upsertEmbeddings([vector]);
  }

  async updateUserEmbedding(userId, embedding, metadata) {
    const vector = {
      id: `user-${userId}`,
      values: embedding,
      metadata: {
        type: 'user',
        userId,
        ...metadata
      }
    };

    return await this.upsertEmbeddings([vector]);
  }

  async findSimilarOpportunities(userEmbedding, topK = 20, filters = {}) {
    const pineconeFilters = {};
    
    // Convert filters to Pinecone format
    if (filters.sector) {
      pineconeFilters.sector = { $eq: filters.sector };
    }
    if (filters.location) {
      pineconeFilters.location = { $eq: filters.location };
    }
    if (filters.remote !== undefined) {
      pineconeFilters.remote = { $eq: filters.remote };
    }

    // Add type filter to only get opportunities
    pineconeFilters.type = { $eq: 'opportunity' };

    return await this.queryEmbeddings(userEmbedding, topK, pineconeFilters);
  }

  async findSimilarUsers(opportunityEmbedding, topK = 50, filters = {}) {
    const pineconeFilters = {};
    
    // Convert filters to Pinecone format
    if (filters.role) {
      pineconeFilters.role = { $eq: filters.role };
    }
    if (filters.location) {
      pineconeFilters.location = { $eq: filters.location };
    }
    if (filters.socialCategory) {
      pineconeFilters.socialCategory = { $eq: filters.socialCategory };
    }

    // Add type filter to only get users
    pineconeFilters.type = { $eq: 'user' };

    return await this.queryEmbeddings(opportunityEmbedding, topK, pineconeFilters);
  }

  async getIndexStats() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.index) {
      return {
        totalVectorCount: 1000,
        dimension: 384,
        indexFullness: 0.1,
        mock: true
      };
    }

    try {
      const stats = await this.index.describeIndexStats();
      return stats;
    } catch (error) {
      console.error('Failed to get index stats:', error);
      return null;
    }
  }

  async batchUpsertOpportunities(opportunities, embeddings) {
    if (opportunities.length !== embeddings.length) {
      throw new Error('Opportunities and embeddings arrays must have the same length');
    }

    const vectors = opportunities.map((opp, index) => ({
      id: `opportunity-${opp._id}`,
      values: embeddings[index],
      metadata: {
        type: 'opportunity',
        opportunityId: opp._id.toString(),
        title: opp.title,
        company: opp.company,
        sector: opp.sector,
        location: opp.location?.address || '',
        remote: opp.location?.remote || false,
        skills: opp.skills?.map(s => s.name) || [],
        stipend: opp.stipend?.amount || 0,
        duration: opp.duration?.months || 0
      }
    }));

    // Batch upsert in chunks of 100
    const chunkSize = 100;
    const results = [];

    for (let i = 0; i < vectors.length; i += chunkSize) {
      const chunk = vectors.slice(i, i + chunkSize);
      const result = await this.upsertEmbeddings(chunk);
      results.push(result);
    }

    return results;
  }

  async batchUpsertUsers(users, embeddings) {
    if (users.length !== embeddings.length) {
      throw new Error('Users and embeddings arrays must have the same length');
    }

    const vectors = users.map((user, index) => ({
      id: `user-${user._id}`,
      values: embeddings[index],
      metadata: {
        type: 'user',
        userId: user._id.toString(),
        role: user.role,
        skills: user.skills || [],
        location: user.location?.address || '',
        socialCategory: user.socialCategory || 'general',
        isRural: user.location?.isRural || false,
        isPwD: user.isPwD || false,
        qualifications: user.qualifications || '',
        experience: user.experience || ''
      }
    }));

    // Batch upsert in chunks of 100
    const chunkSize = 100;
    const results = [];

    for (let i = 0; i < vectors.length; i += chunkSize) {
      const chunk = vectors.slice(i, i + chunkSize);
      const result = await this.upsertEmbeddings(chunk);
      results.push(result);
    }

    return results;
  }
}

const pineconeService = new PineconeService();

module.exports = { pineconeService };