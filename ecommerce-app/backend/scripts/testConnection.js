import mongoose from 'mongoose';
import Department from '../models/Department.js';
import Product from '../models/Product.js';

async function testConnection() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected successfully');
    
    console.log('📊 Testing Department model...');
    const testDept = new Department({ name: 'Test Department' });
    console.log('✅ Department model works');
    
    console.log('📦 Testing Product model...');
    const productCount = await Product.countDocuments();
    console.log(`✅ Found ${productCount} products in database`);
    
    console.log('🎉 All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testConnection();
