import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Add text index for searching
departmentSchema.index({ name: 'text', description: 'text' });

// Static method to get all active departments
departmentSchema.statics.getActiveDepartments = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

// Instance method to get products in this department
departmentSchema.methods.getProducts = function() {
  const Product = mongoose.model('Product');
  return Product.find({ department_id: this._id });
};

const Department = mongoose.model('Department', departmentSchema);

export default Department;
