import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

const upcomingProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priceRangeMin: {
    type: Number,
    required: true
  },
  priceRangeMax: {
    type: Number,
    required: true
  },
  launchDate: {
    type: Date,
    required: true
  },
  completionDate: {
    type: Date
  },
  totalUnits: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: String,
    required: true
  },
  amenities: {
    type: [String]
  },
  specifications: {
    type: String
  },
  developerInfo: {
    type: String
  },
  contactPhone: {
    type: String,
    required: true
  },
  image: {
    type: [String],
    required: true
  },
  registrations: [registrationSchema],
  registeredUsers: {
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

// Update the updatedAt timestamp before saving
upcomingProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add this virtual property to count registrations
upcomingProjectSchema.virtual('registeredUsersCount').get(function() {
  return this.registrations ? this.registrations.length : 0;
});

// Make sure virtuals are included in JSON
upcomingProjectSchema.set('toJSON', { virtuals: true });
upcomingProjectSchema.set('toObject', { virtuals: true });

const UpcomingProject = mongoose.model('UpcomingProject', upcomingProjectSchema);

export default UpcomingProject;