# AI-Based Smart Allocation Engine for PM Internship Scheme

A comprehensive platform that leverages artificial intelligence to match students with internship opportunities while ensuring fairness, transparency, and compliance with government diversity requirements.

## 🚀 Features

### Core Functionality
- **AI-Powered Matching**: Advanced ML algorithms using BERT embeddings and similarity search
- **Multi-Role Dashboard**: Separate interfaces for applicants, mentors, recruiters, and admins
- **Real-time Notifications**: Socket.IO powered live updates
- **Document Verification**: OCR-based document validation with government database integration
- **Blockchain Transparency**: Ethereum-based allocation records for immutable transparency

### Advanced Features
- **AR/VR Preview**: 3D office environment visualization for opportunities
- **Voice Interface**: Voice commands for accessibility
- **Geospatial Analytics**: Location-based matching with focus on aspirational districts
- **Gamification**: Points, badges, and leaderboards to boost engagement
- **Bias Detection**: AI-powered fairness monitoring and compliance reporting
- **WebAuthn Security**: Passwordless authentication with biometric support

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Framer Motion animations
- **State Management**: Redux Toolkit
- **3D Graphics**: Three.js with React Three Fiber
- **Charts**: Recharts for data visualization
- **Maps**: React Leaflet for geospatial features

### Backend (Node.js)
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with WebAuthn support
- **ML/AI**: ONNX Runtime for model inference
- **Vector Search**: Pinecone for similarity matching
- **Blockchain**: Web3.js for Ethereum integration
- **Real-time**: Socket.IO for live updates

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Caching**: Redis for session management
- **Queue System**: BullMQ for background jobs
- **File Storage**: Local storage with cloud backup
- **Monitoring**: Built-in health checks and metrics

## 📁 Project Structure

```
project/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── redux/           # State management
│   │   └── ...
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── server.js        # Main server file
│   ├── models/              # ML model files (.onnx)
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- Redis 6.0+
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your configuration
   
   # Start the server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Docker Setup (Alternative)**
   ```bash
   # Build and run with Docker Compose
   docker-compose up --build
   ```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/pm-internship
JWT_SECRET=your-jwt-secret
REDIS_URL=redis://localhost:6379

# Optional: AI/ML Services
PINECONE_API_KEY=your-pinecone-key
GOOGLE_CLOUD_PROJECT_ID=your-project-id

# Optional: Blockchain
ETHEREUM_RPC_URL=your-ethereum-rpc
CONTRACT_ADDRESS=your-contract-address

# Optional: External APIs
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

## 🎯 Key Features Explained

### AI Matching Algorithm
The system uses a sophisticated multi-criteria matching algorithm:

1. **Content Similarity**: BERT embeddings for semantic matching
2. **Skill Overlap**: Weighted skill matching with proficiency levels
3. **Location Preference**: Geospatial distance calculation
4. **Diversity Scoring**: Affirmative action compliance
5. **ML Ranking**: LightGBM model for final score optimization

### Compliance & Fairness
- **Quota Management**: Automatic SC/ST/OBC/PwD quota tracking
- **Bias Detection**: Real-time fairness monitoring
- **Audit Trail**: Complete allocation history
- **Transparency**: Public blockchain records

### Security Features
- **WebAuthn**: Passwordless authentication
- **JWT Tokens**: Secure session management
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Comprehensive data sanitization
- **CORS Protection**: Cross-origin request security

## 📊 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET  /api/auth/profile     # Get user profile
```

### Matching Endpoints
```
POST /api/matching/run     # Run matching algorithm
GET  /api/matching/matches # Get user matches
POST /api/matching/apply   # Apply to opportunity
```

### Document Endpoints
```
POST /api/documents/upload    # Upload document
GET  /api/documents          # Get user documents
POST /api/documents/verify   # Verify document
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
npm run test:coverage
```

### Backend Testing
```bash
cd backend
npm run test
npm run test:integration
```

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

### Docker Deployment
```bash
# Build production images
docker build -t pm-internship-frontend ./frontend
docker build -t pm-internship-backend ./backend

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Ministry of Corporate Affairs, Government of India
- Smart India Hackathon Initiative
- Open source community for amazing tools and libraries

## 📞 Support

For support and queries:
- Email: support@pm-internship.gov.in
- Documentation: [docs.pm-internship.gov.in](https://docs.pm-internship.gov.in)
- Issues: GitHub Issues page

---

**Built with ❤️ for Digital India and Atmanirbhar Bharat initiatives**