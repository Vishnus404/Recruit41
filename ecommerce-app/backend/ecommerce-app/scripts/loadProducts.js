import csv from 'csvtojson';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const loadProducts = async () => {
  try {
    const csvPath = path.join(__dirname, '../data/products.csv');
    console.log(`📄 Loading products from: ${csvPath}`);
    
    const data = await csv().fromFile(csvPath);
    console.log(`📊 Found ${data.length} products to import`);
    
    await Product.deleteMany();
    await Product.insertMany(data);
    console.log('✅ Products loaded successfully');
  } catch (error) {
    console.error('❌ Error loading products:', error.message);
    throw error;
  }
};

if (process.argv[1].includes('loadProducts.js')) {
  mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
      await loadProducts();
    } finally {
      mongoose.disconnect();
    }
  });
}

export default loadProducts;
