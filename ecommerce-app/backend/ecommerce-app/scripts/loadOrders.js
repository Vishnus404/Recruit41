import csv from 'csvtojson';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Order from '../models/Order.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const loadOrders = async () => {
  try {
    const csvPath = path.join(__dirname, '../data/orders.csv');
    console.log(`📄 Loading orders from: ${csvPath}`);
    
    const data = await csv().fromFile(csvPath);
    console.log(`📊 Found ${data.length} orders to import`);
    
    await Order.deleteMany();
    await Order.insertMany(data);
    console.log('✅ Orders loaded successfully');
  } catch (error) {
    console.error('❌ Error loading orders:', error.message);
    throw error;
  }
};

if (process.argv[1].includes('loadOrders.js')) {
  mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
      await loadOrders();
    } finally {
      mongoose.disconnect();
    }
  });
}

export default loadOrders;
