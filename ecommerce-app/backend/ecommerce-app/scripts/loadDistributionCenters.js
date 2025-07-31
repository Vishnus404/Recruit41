import csv from 'csvtojson';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import DistributionCenter from '../models/Distribution.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const loadDistributionCenters = async () => {
  try {
    const csvPath = path.join(__dirname, '../data/distribution_centers.csv');
    console.log(`📄 Loading distribution centers from: ${csvPath}`);
    
    const data = await csv().fromFile(csvPath);
    console.log(`📊 Found ${data.length} distribution centers to import`);
    
    await DistributionCenter.deleteMany();
    await DistributionCenter.insertMany(data);
    console.log('✅ Distribution Centers loaded successfully');
  } catch (error) {
    console.error('❌ Error loading distribution centers:', error.message);
    throw error;
  }
};

if (process.argv[1].includes('loadDistributionCenters.js')) {
  mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
      await loadDistributionCenters();
    } finally {
      mongoose.disconnect();
    }
  });
}

export default loadDistributionCenters;
