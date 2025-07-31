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
    
    // Filter out users with missing required fields
    const validUsers = data.filter(user => {
      const isValid = user.id && user.id.trim().length > 0 &&
                     user.first_name && user.first_name.trim().length > 0 &&
                     user.last_name && user.last_name.trim().length > 0 &&
                     user.email && user.email.trim().length > 0 &&
                     (!user.traffic_source || ['Search', 'Email', 'Social', 'Direct', 'Referral', 'Organic', 'Display', 'Facebook'].includes(user.traffic_source));
      
      if (!isValid) {
        console.log(`⚠️  Skipping invalid user: ID=${user.id}, traffic_source=${user.traffic_source}`);
      }
      return isValid;
    });
    
    console.log(`✅ ${validUsers.length} valid users found (${data.length - validUsers.length} invalid users skipped)`);
    
    await User.deleteMany();
    
    if (validUsers.length > 0) {
      await User.insertMany(validUsers);
      console.log('✅ Users loaded successfully');
    } else {
      console.log('⚠️  No valid users to load');
    }
  } catch (error) {
    console.error('❌ Error loading users:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Validation details:', error.errors);
    }
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
