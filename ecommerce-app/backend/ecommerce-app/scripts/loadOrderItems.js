import csv from 'csvtojson';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import OrderItem from '../models/OrderItem.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const loadOrderItems = async () => {
  try {
    const csvPath = path.join(__dirname, '../data/order_items.csv');
    console.log(`📄 Loading order items from: ${csvPath}`);
    
    const data = await csv().fromFile(csvPath);
    console.log(`📊 Found ${data.length} order items to import`);
    
    await OrderItem.deleteMany();
    await OrderItem.insertMany(data);
    console.log('✅ Order Items loaded successfully');
  } catch (error) {
    console.error('❌ Error loading order items:', error.message);
    throw error;
  }
};

if (process.argv[1].includes('loadOrderItems.js')) {
  mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
      await loadOrderItems();
    } finally {
      mongoose.disconnect();
    }
  });
}

export default loadOrderItems;
