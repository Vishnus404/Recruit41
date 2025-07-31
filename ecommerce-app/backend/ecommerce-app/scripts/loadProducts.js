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
    
    // Filter out products with missing required fields
    const validProducts = data.filter(product => {
      const isValid = product.name && product.name.trim().length > 0 &&
                     product.id && product.id.trim().length > 0 &&
                     product.category && product.category.trim().length > 0 &&
                     product.brand && product.brand.trim().length > 0 &&
                     product.department && product.department.trim().length > 0 &&
                     product.sku && product.sku.trim().length > 0;
      
      if (!isValid) {
        console.log(`⚠️  Skipping invalid product: ${JSON.stringify(product)}`);
      }
      return isValid;
    });
    
    console.log(`✅ ${validProducts.length} valid products found (${data.length - validProducts.length} invalid products skipped)`);
    
    await Product.deleteMany();
    
    if (validProducts.length > 0) {
      await Product.insertMany(validProducts);
      console.log('✅ Products loaded successfully');
    } else {
      console.log('⚠️  No valid products to load');
    }
  } catch (error) {
    console.error('❌ Error loading products:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Validation details:', error.errors);
    }
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
