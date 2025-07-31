import mongoose from 'mongoose';
import dotenv from 'dotenv';

import loadDistributionCenters from './loadDistributionCenters.js';
import loadProducts from './loadProducts.js';
import loadInventoryItems from './loadInventoryItems.js';
import loadUsers from './loadUsers.js';
import loadOrders from './loadOrders.js';
import loadOrderItems from './loadOrderItems.js';

dotenv.config();

const runAll = async () => {
  const startTime = Date.now();
  
  try {
    console.log('🚀 Starting data import process...\n');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 Connected to MongoDB\n');

    // Load data in proper order (dependencies first)
    await loadDistributionCenters();
    await loadProducts();
    await loadInventoryItems();
    await loadUsers();
    await loadOrders();
    await loadOrderItems();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n🎉 All data loaded successfully!');
    console.log(`⏱️  Total time: ${duration} seconds`);
    
  } catch (err) {
    console.error('\n❌ Data import failed:', err.message);
    console.error('Stack trace:', err.stack);
    process.exit(1);
  } finally {
    try {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    } catch (disconnectError) {
      console.error('❌ Error disconnecting from MongoDB:', disconnectError.message);
    }
  }
};

runAll();
