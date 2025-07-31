// backend/models/OrderItem.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: String,
  order_id: String,
  user_id: String,
  product_id: String,
  inventory_item_id: String,
  status: String,
  created_at: Date,
  shipped_at: Date,
  delivered_at: Date,
  returned_at: Date
});

export default mongoose.model('OrderItem', orderItemSchema);
