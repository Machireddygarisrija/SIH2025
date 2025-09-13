const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: String,
  sector: {
    type: String,
    required: true
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    }
  }],
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    district: String,
    state: String,
    remote: {
      type: Boolean,
      default: false
    }
  },
  duration: {
    months: Number,
    startDate: Date,
    endDate: Date
  },
  stipend: {
    amount: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  slots: {
    total: {
      type: Number,
      required: true
    },
    filled: {
      type: Number,
      default: 0
    },
    reserved: {
      sc: { type: Number, default: 0 },
      st: { type: Number, default: 0 },
      obc: { type: Number, default: 0 },
      pwd: { type: Number, default: 0 },
      women: { type: Number, default: 0 },
      rural: { type: Number, default: 0 }
    }
  },
  requirements: {
    minQualification: String,
    preferredQualifications: [String],
    experience: String,
    ageLimit: Number
  },
  applicationDeadline: Date,
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'completed'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  tags: [String],
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  },
  
  // AI Generated fields
  aiSuggestions: {
    description: String,
    skills: [String],
    tags: [String]
  },
  
  // Compliance
  diversityScore: {
    type: Number,
    default: 0
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
opportunitySchema.index({ recruiter: 1 });
opportunitySchema.index({ status: 1 });
opportunitySchema.index({ sector: 1 });
opportunitySchema.index({ 'location.coordinates': '2dsphere' });
opportunitySchema.index({ skills: 1 });
opportunitySchema.index({ applicationDeadline: 1 });
opportunitySchema.index({ createdAt: -1 });

// Text search index
opportunitySchema.index({
  title: 'text',
  description: 'text',
  company: 'text',
  sector: 'text'
});

// Virtual for available slots
opportunitySchema.virtual('availableSlots').get(function() {
  return this.slots.total - this.slots.filled;
});

// Pre-save middleware
opportunitySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Opportunity', opportunitySchema);