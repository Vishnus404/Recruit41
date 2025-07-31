#!/usr/bin/env node

// ===============================================
// 🎯 E-COMMERCE DATABASE DEMO QUERIES - NODE.JS
// ===============================================

import mongoose from 'mongoose';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';

async function runDemoQueries() {
  try {
    console.log('🎯 E-COMMERCE DATABASE DEMO QUERIES');
    console.log('=====================================\n');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB\n');
    
    // 1. Collection Statistics
    console.log('📊 COLLECTION STATISTICS:');
    console.log('=========================');
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    
    console.log(`   📦 Products: ${productCount.toLocaleString()}`);
    console.log(`   👥 Users: ${userCount.toLocaleString()}`);
    console.log(`   🛒 Orders: ${orderCount.toLocaleString()}\n`);
    
    // 2. Product Categories Analysis
    console.log('🏷️  TOP PRODUCT CATEGORIES:');
    console.log('============================');
    const categories = await Product.aggregate([
      { 
        $group: { 
          _id: '$category', 
          count: { $sum: 1 }, 
          avgPrice: { $avg: '$retail_price' } 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);
    
    categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat._id}: ${cat.count.toLocaleString()} products (avg $${cat.avgPrice.toFixed(2)})`);
    });
    console.log('');
    
    // 3. Sample Products
    console.log('🛍️  SAMPLE PRODUCTS:');
    console.log('====================');
    const sampleProducts = await Product.find()
      .limit(5)
      .select('name category brand retail_price cost');
    
    sampleProducts.forEach((product, index) => {
      const profit = (product.retail_price - product.cost).toFixed(2);
      console.log(`   ${index + 1}. ${product.name}`);
      console.log(`      Category: ${product.category} | Brand: ${product.brand}`);
      console.log(`      Price: $${product.retail_price} | Profit: $${profit}\n`);
    });
    
    // 4. User Traffic Sources
    console.log('📈 USER ACQUISITION SOURCES:');
    console.log('=============================');
    const trafficSources = await User.aggregate([
      { $group: { _id: '$traffic_source', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    trafficSources.forEach((source, index) => {
      const percentage = ((source.count / userCount) * 100).toFixed(1);
      console.log(`   ${index + 1}. ${source._id}: ${source.count.toLocaleString()} users (${percentage}%)`);
    });
    console.log('');
    
    // 5. Top Brands
    console.log('🏭 TOP PRODUCT BRANDS:');
    console.log('=======================');
    const topBrands = await Product.aggregate([
      { 
        $group: { 
          _id: '$brand', 
          productCount: { $sum: 1 }, 
          avgPrice: { $avg: '$retail_price' } 
        } 
      },
      { $sort: { productCount: -1 } },
      { $limit: 10 }
    ]);
    
    topBrands.forEach((brand, index) => {
      console.log(`   ${index + 1}. ${brand._id}: ${brand.productCount} products (avg $${brand.avgPrice.toFixed(2)})`);
    });
    console.log('');
    
    // 6. Price Range Analysis
    console.log('💰 PRICE RANGE DISTRIBUTION:');
    console.log('=============================');
    const priceRanges = await Product.aggregate([
      {
        $bucket: {
          groupBy: '$retail_price',
          boundaries: [0, 10, 25, 50, 100, 200, 500, 1000],
          default: '1000+',
          output: {
            count: { $sum: 1 },
            avgPrice: { $avg: '$retail_price' }
          }
        }
      }
    ]);
    
    priceRanges.forEach(range => {
      const rangeLabel = range._id === '1000+' ? '$1000+' : `$${range._id}-$${priceRanges[priceRanges.indexOf(range) + 1]?._id || '∞'}`;
      console.log(`   ${rangeLabel}: ${range.count.toLocaleString()} products (avg $${range.avgPrice.toFixed(2)})`);
    });
    console.log('');
    
    // 7. Data Quality Check
    console.log('✅ DATA QUALITY VALIDATION:');
    console.log('============================');
    
    // Check for duplicate emails
    const duplicateEmails = await User.aggregate([
      { $group: { _id: '$email', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $count: 'duplicates' }
    ]);
    
    const duplicateCount = duplicateEmails[0]?.duplicates || 0;
    console.log(`   📧 Duplicate emails: ${duplicateCount} ${duplicateCount === 0 ? '✅' : '❌'}`);
    
    // Check price consistency
    const invalidPrices = await Product.find({
      $expr: { $lt: ['$retail_price', '$cost'] }
    }).countDocuments();
    
    console.log(`   💰 Invalid prices (retail < cost): ${invalidPrices} ${invalidPrices === 0 ? '✅' : '❌'}`);
    
    // Check for missing fields
    const missingFields = await Product.find({
      $or: [
        { name: { $exists: false } },
        { name: '' },
        { category: { $exists: false } },
        { brand: { $exists: false } }
      ]
    }).countDocuments();
    
    console.log(`   📝 Missing required fields: ${missingFields} ${missingFields === 0 ? '✅' : '❌'}`);
    console.log('');
    
    console.log('🎉 Demo queries completed successfully!');
    console.log('💡 Use these insights for your presentation and analysis.');
    
  } catch (error) {
    console.error('❌ Error running demo queries:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the demo
runDemoQueries().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
