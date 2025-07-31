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
    
    // Filter out products with missing required fields and track unique IDs/SKUs
    const seenIds = new Set();
    const seenSkus = new Set();
    const validProducts = [];
    let duplicateCount = 0;
    
    data.forEach(product => {
      const isValidData = product.name && product.name.trim().length > 0 &&
                         product.id && product.id.trim().length > 0 &&
                         product.category && product.category.trim().length > 0 &&
                         product.brand && product.brand.trim().length > 0 &&
                         product.department && product.department.trim().length > 0 &&
                         product.sku && product.sku.trim().length > 0;
      
      const isDuplicateId = seenIds.has(product.id);
      const isDuplicateSku = seenSkus.has(product.sku);
      
      if (!isValidData) {
        console.log(`⚠️  Skipping invalid product: ID=${product.id}, name="${product.name}"`);
      } else if (isDuplicateId || isDuplicateSku) {
        duplicateCount++;
        if (duplicateCount <= 5) { // Only log first 5 duplicates
          console.log(`⚠️  Skipping duplicate product: ID=${product.id}, SKU=${product.sku}`);
        }
      } else {
        seenIds.add(product.id);
        seenSkus.add(product.sku);
        validProducts.push(product);
      }
    });
    
    console.log(`✅ ${validProducts.length} valid unique products found`);
    console.log(`⚠️  ${data.length - validProducts.length} products skipped (${duplicateCount} duplicates, ${data.length - validProducts.length - duplicateCount} invalid)`);
    
    await Product.deleteMany();
    
    if (validProducts.length > 0) {
      // Insert in batches for better performance
      const batchSize = 1000;
      for (let i = 0; i < validProducts.length; i += batchSize) {
        const batch = validProducts.slice(i, i + batchSize);
        await Product.insertMany(batch);
        console.log(`📦 Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(validProducts.length/batchSize)} (${batch.length} products)`);
      }
      console.log('✅ Products loaded successfully');
    } else {
      console.log('⚠️  No valid products to load');
    }
  } catch (error) {
    console.error('❌ Error loading products:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Validation details:', error.errors);
    } else if (error.code === 11000) {
      console.error('Duplicate key error - this should have been handled by deduplication logic');
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
