// backend/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  first_name: { 
    type: String, 
    required: true,
    trim: true 
  },
  last_name: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  age: { 
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age cannot exceed 150']
  },
  gender: { 
    type: String,
    enum: ['M', 'F', 'Other', 'male', 'female', 'other'],
    trim: true
  },
  state: { 
    type: String,
    trim: true
  },
  street_address: { 
    type: String,
    trim: true
  },
  postal_code: { 
    type: String,
    trim: true
  },
  city: { 
    type: String,
    trim: true
  },
  country: { 
    type: String,
    trim: true
  },
  latitude: { 
    type: Number,
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90']
  },
  longitude: { 
    type: Number,
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180']
  },
  traffic_source: { 
    type: String,
    enum: ['Search', 'Email', 'Social', 'Direct', 'Referral', 'Organic', 'Display', 'Facebook'],
    trim: true
  },
  created_at: { 
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Create indexes for better performance (email index already created by unique: true)
userSchema.index({ created_at: -1 });
userSchema.index({ state: 1, city: 1 });

export default mongoose.model('User', userSchema);
