const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['marksMemo', 'pan', 'aadhaar'],
    required: true
  },
  filename: String,
  originalName: String,
  path: String,
  verified: {
    type: Boolean,
    default: false
  },
  ocrData: mongoose.Schema.Types.Mixed,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['applicant', 'mentor', 'recruiter', 'admin'],
    required: true
  },
  phone: String,
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    district: String,
    state: String,
    isRural: {
      type: Boolean,
      default: false
    },
    isAspirational: {
      type: Boolean,
      default: false
    }
  },
  
  // Applicant specific fields
  skills: [String],
  qualifications: String,
  experience: String,
  socialCategory: {
    type: String,
    enum: ['general', 'sc', 'st', 'obc'],
    default: 'general'
  },
  isPwD: {
    type: Boolean,
    default: false
  },
  documents: [documentSchema],
  profileCompletion: {
    type: Number,
    default: 0
  },
  
  // Mentor specific fields
  expertise: [String],
  company: String,
  designation: String,
  mentorRating: {
    type: Number,
    default: 0
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  
  // Recruiter specific fields
  companyName: String,
  companySize: String,
  industry: String,
  
  // Gamification
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    earnedAt: Date,
    description: String
  }],
  level: {
    type: Number,
    default: 1
  },
  
  // System fields
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'location.coordinates': '2dsphere' });
userSchema.index({ skills: 1 });
userSchema.index({ expertise: 1 });

// Virtual for full profile completion
userSchema.virtual('isProfileComplete').get(function() {
  return this.profileCompletion >= 100;
});

// Pre-save middleware
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate profile completion for applicants
  if (this.role === 'applicant') {
    let completion = 0;
    if (this.name) completion += 10;
    if (this.email) completion += 10;
    if (this.phone) completion += 10;
    if (this.location?.address) completion += 15;
    if (this.skills?.length > 0) completion += 20;
    if (this.qualifications) completion += 15;
    if (this.documents?.length >= 3) completion += 20;
    
    this.profileCompletion = completion;
  }
  
  next();
});

module.exports = mongoose.model('User', userSchema);