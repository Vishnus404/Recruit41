// backend/models/DistributionCenter.js
import mongoose from 'mongoose';

const distributionCenterSchema = new mongoose.Schema({
  id: String,
  name: String,
  latitude: Number,
  longitude: Number
});

export default mongoose.model('DistributionCenter', distributionCenterSchema);
