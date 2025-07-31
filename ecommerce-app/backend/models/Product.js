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
    required: [true, 'Product name is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Product name cannot be empty'
    }
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
  department_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
    index: true
  },
  // Keep the old department field temporarily for migration
  department: { 
    type: String,
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
productSchema.index({ department_id: 1, category: 1 });
productSchema.index({ department: 1, category: 1 }); // Keep for migration

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function() {
  return this.retail_price - this.cost;
});

// Virtual to populate department information
productSchema.virtual('departmentInfo', {
  ref: 'Department',
  localField: 'department_id',
  foreignField: '_id',
  justOne: true
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', productSchema);
