import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  cost: { 
    type: Number,
    required: true,
    min: [0, 'Cost cannot be negative']
  },
  category: { 
    type: String,
    required: true,
    trim: true,
    index: true
  },
  name: { 
    type: String,
    required: true,
    trim: true
  },
  brand: { 
    type: String,
    required: true,
    trim: true,
    index: true
  },
  retail_price: { 
    type: Number,
    required: true,
    min: [0, 'Retail price cannot be negative']
  },
  department: { 
    type: String,
    required: true,
    trim: true,
    index: true
  },
  sku: { 
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  distribution_center_id: { 
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true,
  collection: 'products'
});

// Create compound indexes for better performance (distribution_center_id index already created by index: true)
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ department: 1, category: 1 });

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function() {
  return this.retail_price - this.cost;
});

export default mongoose.model('Product', productSchema);
