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
    
    // Filter out users with missing required fields and track unique emails
    const seenEmails = new Set();
    const seenIds = new Set();
    const validUsers = [];
    let duplicateCount = 0;
    
    data.forEach(user => {
      const isValidData = user.id && user.id.trim().length > 0 &&
                         user.first_name && user.first_name.trim().length > 0 &&
                         user.last_name && user.last_name.trim().length > 0 &&
                         user.email && user.email.trim().length > 0 &&
                         (!user.traffic_source || ['Search', 'Email', 'Social', 'Direct', 'Referral', 'Organic', 'Display', 'Facebook'].includes(user.traffic_source));
      
      const isDuplicateEmail = seenEmails.has(user.email?.toLowerCase());
      const isDuplicateId = seenIds.has(user.id);
      
      if (!isValidData) {
        console.log(`⚠️  Skipping invalid user: ID=${user.id}, email=${user.email}, traffic_source=${user.traffic_source}`);
      } else if (isDuplicateEmail || isDuplicateId) {
        duplicateCount++;
        if (duplicateCount <= 5) { // Only log first 5 duplicates to avoid spam
          console.log(`⚠️  Skipping duplicate user: ID=${user.id}, email=${user.email}`);
        }
      } else {
        seenEmails.add(user.email.toLowerCase());
        seenIds.add(user.id);
        validUsers.push(user);
      }
    });
    
    console.log(`✅ ${validUsers.length} valid unique users found`);
    console.log(`⚠️  ${data.length - validUsers.length} users skipped (${duplicateCount} duplicates, ${data.length - validUsers.length - duplicateCount} invalid)`);
    
    await User.deleteMany();
    
    if (validUsers.length > 0) {
      // Insert in batches to handle large datasets better
      const batchSize = 1000;
      for (let i = 0; i < validUsers.length; i += batchSize) {
        const batch = validUsers.slice(i, i + batchSize);
        await User.insertMany(batch);
        console.log(`📦 Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(validUsers.length/batchSize)} (${batch.length} users)`);
      }
      console.log('✅ Users loaded successfully');
    } else {
      console.log('⚠️  No valid users to load');
    }
  } catch (error) {
    console.error('❌ Error loading users:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Validation details:', error.errors);
    } else if (error.code === 11000) {
      console.error('Duplicate key error - this should have been handled by deduplication logic');
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
