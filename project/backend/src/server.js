@@ .. @@
// Import routes
const authRoutes = require('./routes/auth');
const opportunityRoutes = require('./routes/opportunities');
const matchingRoutes = require('./routes/matching');
const mentorRoutes = require('./routes/mentors');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const chatbotRoutes = require('./routes/chatbot');
const blockchainRoutes = require('./routes/blockchain');
const complianceRoutes = require('./routes/compliance');
+const documentRoutes = require('./routes/documents');
+const geospatialRoutes = require('./routes/geospatial');
+const webauthnRoutes = require('./routes/webauthn');

// Import services
const { initializeRedis } = require('./services/redisService');
const { initializeQueues } = require('./services/queueService');
const { initializeML } = require('./services/mlService');
+const { ocrService } = require('./services/ocrService');
+const { pineconeService } = require('./services/pineconeService');
const socketService = require('./services/socketService');
@@ .. @@
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/compliance', complianceRoutes);
+app.use('/api/documents', documentRoutes);
+app.use('/api/geospatial', geospatialRoutes);
+app.use('/api/webauthn', webauthnRoutes);
@@ .. @@
    // Initialize ML models
    await initializeML();
    console.log('✅ ML models loaded');

+    // Initialize OCR service
+    await ocrService.initialize();
+    console.log('✅ OCR service initialized');
+
+    // Initialize Pinecone service
+    await pineconeService.initialize();
+    console.log('✅ Pinecone service initialized');
+
    // Initialize queues
    await initializeQueues();
    console.log('✅ Job queues initialized');