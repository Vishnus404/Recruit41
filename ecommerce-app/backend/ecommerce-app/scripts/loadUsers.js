import csv from 'csvtojson';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const loadUsers = async () => {
  try {
    const csvPath = path.join(__dirname, '../data/users.csv');
    console.log(`📄 Loading users from: ${csvPath}`);
    
    const data = await csv().fromFile(csvPath);
    console.log(`📊 Found ${data.length} users to import`);
    
    await User.deleteMany();
    await User.insertMany(data);
    console.log('✅ Users loaded successfully');
  } catch (error) {
    console.error('❌ Error loading users:', error.message);
    throw error;
  }
};

if (process.argv[1].includes('loadUsers.js')) {
  mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
      await loadUsers();
    } finally {
      mongoose.disconnect();
    }
  });
}

export default loadUsers;
