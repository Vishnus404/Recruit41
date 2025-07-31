import csv from 'csvtojson';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import InventoryItem from '../models/InventoryItem.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const loadInventoryItems = async () => {
  try {
    const csvPath = path.join(__dirname, '../data/inventory_items.csv');
    console.log(`📄 Loading inventory items from: ${csvPath}`);
    
    const data = await csv().fromFile(csvPath);
    console.log(`📊 Found ${data.length} inventory items to import`);
    
    await InventoryItem.deleteMany();
    await InventoryItem.insertMany(data);
    console.log('✅ Inventory Items loaded successfully');
  } catch (error) {
    console.error('❌ Error loading inventory items:', error.message);
    throw error;
  }
};

if (process.argv[1].includes('loadInventoryItems.js')) {
  mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
      await loadInventoryItems();
    } finally {
      mongoose.disconnect();
    }
  });
}

export default loadInventoryItems;
