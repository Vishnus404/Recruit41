import mongoose from 'mongoose';
import Product from './models/Product.js';

console.log('🎯 Quick Database Demo');
console.log('======================');

try {
  await mongoose.connect('mongodb://localhost:27017/ecommerce');
  console.log('✅ Connected to MongoDB');
  
  const count = await Product.countDocuments();
  console.log(`📦 Total Products: ${count.toLocaleString()}`);
  
  const sample = await Product.findOne();
  console.log(`🛍️  Sample Product: ${sample.name} - $${sample.retail_price}`);
  
  console.log('🎉 Demo completed successfully!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  await mongoose.connection.close();
  process.exit(0);
}
