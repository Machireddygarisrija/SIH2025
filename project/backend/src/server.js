const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

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
const documentRoutes = require('./routes/documents');
const geospatialRoutes = require('./routes/geospatial');
const webauthnRoutes = require('./routes/webauthn');

// Import services
const { initializeRedis } = require('./services/redisService');
const { initializeQueues } = require('./services/queueService');
const { initializeML } = require('./services/mlService');
const { ocrService } = require('./services/ocrService');
const { pineconeService } = require('./services/pineconeService');
const socketService = require('./services/socketService');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for ML models and uploads
app.use('/models', express.static('models'));
app.use('/uploads', express.static('uploads'));

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
app.use('/api/documents', documentRoutes);
app.use('/api/geospatial', geospatialRoutes);
app.use('/api/webauthn', webauthnRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Initialize services
async function initializeServices() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pm-internship', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Initialize Redis
    await initializeRedis();
    console.log('✅ Redis initialized');

    // Initialize ML models
    await initializeML();
    console.log('✅ ML models loaded');

    // Initialize OCR service
    await ocrService.initialize();
    console.log('✅ OCR service initialized');

    // Initialize Pinecone service
    await pineconeService.initialize();
    console.log('✅ Pinecone service initialized');

    // Initialize queues
    await initializeQueues();
    console.log('✅ Job queues initialized');

    // Initialize Socket.IO
    socketService.initialize(io);
    console.log('✅ Socket.IO initialized');

  } catch (error) {
    console.error('❌ Service initialization failed:', error);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await initializeServices();
});

module.exports = { app, server, io };