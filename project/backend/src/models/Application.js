const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'under_review', 'shortlisted', 'interview_scheduled', 'selected', 'rejected', 'withdrawn'],
    default: 'applied'
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100
  },
  matchExplanation: [{
    factor: String,
    score: Number,
    explanation: String
  }],
  
  // Application data
  coverLetter: String,
  additionalDocuments: [{
    name: String,
    path: String,
    uploadedAt: Date
  }],
  
  // Interview details
  interview: {
    scheduled: Boolean,
    dateTime: Date,
    mode: {
      type: String,
      enum: ['online', 'offline', 'phone']
    },
    link: String,
    feedback: String,
    score: Number
  },
  
  // Selection details
  selection: {
    selected: Boolean,
    reason: String,
    startDate: Date,
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Tracking
  timeline: [{
    status: String,
    timestamp: Date,
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Compliance tracking
  diversityCategory: String,
  priorityScore: Number,
  
  // Blockchain record
  blockchainRecord: {
    transactionHash: String,
    blockNumber: Number,
    timestamp: Date
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
applicationSchema.index({ applicant: 1 });
applicationSchema.index({ opportunity: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ matchScore: -1 });
applicationSchema.index({ createdAt: -1 });

// Compound indexes
applicationSchema.index({ applicant: 1, opportunity: 1 }, { unique: true });
applicationSchema.index({ opportunity: 1, status: 1 });

// Pre-save middleware
applicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Add to timeline if status changed
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
      note: `Status changed to ${this.status}`
    });
  }
  
  next();
});

module.exports = mongoose.model('Application', applicationSchema);