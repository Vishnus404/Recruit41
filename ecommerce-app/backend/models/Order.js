// backend/models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  order_id: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  user_id: { 
    type: String,
    required: true,
    index: true
  },
  status: { 
    type: String,
    required: true,
    enum: ['Processing', 'Shipped', 'Complete', 'Cancelled', 'Returned'],
    default: 'Processing',
    index: true
  },
  gender: { 
    type: String,
    enum: ['M', 'F', 'Other', 'male', 'female', 'other']
  },
  created_at: { 
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  returned_at: { 
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v >= this.created_at;
      },
      message: 'Return date cannot be before creation date'
    }
  },
  shipped_at: { 
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v >= this.created_at;
      },
      message: 'Ship date cannot be before creation date'
    }
  },
  delivered_at: { 
    type: Date,
    validate: {
      validator: function(v) {
        return !v || !this.shipped_at || v >= this.shipped_at;
      },
      message: 'Delivery date cannot be before ship date'
    }
  },
  num_of_item: { 
    type: Number,
    required: true,
    min: [1, 'Order must contain at least 1 item']
  }
}, {
  timestamps: true,
  collection: 'orders'
});

// Create compound indexes for better performance
orderSchema.index({ user_id: 1, created_at: -1 });
orderSchema.index({ status: 1, created_at: -1 });
orderSchema.index({ created_at: -1 });

export default mongoose.model('Order', orderSchema);
