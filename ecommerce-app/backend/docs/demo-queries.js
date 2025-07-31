// ===============================================
// 🎯 E-COMMERCE DATABASE DEMO QUERIES
// ===============================================
// Use these in MongoDB Compass or mongo shell for your demo

// ===========================================
// 1. DATABASE OVERVIEW
// ===========================================

// Switch to ecommerce database
use ecommerce

// Show all collections
show collections

// Get database statistics
db.stats()

// Count records in each collection
db.distribution_centers.countDocuments()  // ~12
db.products.countDocuments()             // ~29,000
db.inventory_items.countDocuments()      // ~490,000
db.users.countDocuments()               // ~100,000
db.orders.countDocuments()              // ~50,000
db.order_items.countDocuments()         // ~200,000

// ===========================================
// 2. SAMPLE RECORDS (Show Data Structure)
// ===========================================

// Show 3 sample products with all fields
db.products.find().limit(3).pretty()

// Show sample users with key fields only
db.users.find({}, {
  first_name: 1,
  last_name: 1,
  email: 1,
  age: 1,
  city: 1,
  country: 1,
  traffic_source: 1
}).limit(5).pretty()

// Show sample orders
db.orders.find({}, {
  order_id: 1,
  user_id: 1,
  status: 1,
  created_at: 1,
  num_of_item: 1
}).limit(5).pretty()

// ===========================================
// 3. BUSINESS ANALYTICS QUERIES
// ===========================================

// Product categories breakdown
db.products.aggregate([
  { 
    $group: { 
      _id: "$category", 
      count: { $sum: 1 }, 
      avg_price: { $avg: "$retail_price" } 
    } 
  },
  { $sort: { count: -1 } }
])

// User acquisition by traffic source
db.users.aggregate([
  { $group: { _id: "$traffic_source", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// Order status distribution  
db.orders.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// Top 10 product brands
db.products.aggregate([
  { 
    $group: { 
      _id: "$brand", 
      product_count: { $sum: 1 }, 
      avg_price: { $avg: "$retail_price" } 
    } 
  },
  { $sort: { product_count: -1 } },
  { $limit: 10 }
])

// ===========================================
// 4. ADVANCED BUSINESS INSIGHTS
// ===========================================

// Most profitable departments
db.products.aggregate([
  {
    $group: {
      _id: "$department",
      product_count: { $sum: 1 },
      avg_cost: { $avg: "$cost" },
      avg_price: { $avg: "$retail_price" },
      avg_margin: { $avg: { $subtract: ["$retail_price", "$cost"] } }
    }
  },
  { $sort: { avg_margin: -1 } }
])

// Customer demographics by country
db.users.aggregate([
  { 
    $group: { 
      _id: "$country", 
      user_count: { $sum: 1 }, 
      avg_age: { $avg: "$age" } 
    } 
  },
  { $sort: { user_count: -1 } },
  { $limit: 10 }
])

// Price range analysis
db.products.aggregate([
  {
    $bucket: {
      groupBy: "$retail_price",
      boundaries: [0, 10, 25, 50, 100, 200, 1000],
      default: "Other",
      output: {
        count: { $sum: 1 },
        products: { $push: "$name" }
      }
    }
  }
])

// ===========================================
// 5. DATA QUALITY VALIDATION QUERIES
// ===========================================

// Check for duplicate emails (should be 0 after our fixes)
db.users.aggregate([
  { $group: { _id: "$email", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } },
  { $count: "duplicates" }
])

// Validate price consistency (retail > cost)
db.products.find({
  $expr: { $lt: ["$retail_price", "$cost"] }
}).count()

// Check for missing required fields
db.products.find({
  $or: [
    { name: { $exists: false } },
    { name: "" },
    { category: { $exists: false } },
    { brand: { $exists: false } }
  ]
}).count()

// ===========================================
// 6. PERFORMANCE DEMONSTRATION
// ===========================================

// Show indexes on products collection
db.products.getIndexes()

// Show indexes on users collection
db.users.getIndexes()

// Fast category search (uses index)
db.products.find({ category: "Accessories" }).limit(5)

// Fast user lookup by email (uses unique index)
db.users.findOne({ email: "timothybush@example.net" })

// Price range query with explain plan
db.products.find({ 
  retail_price: { $gte: 10, $lte: 50 } 
}).explain("executionStats")

// ===========================================
// 7. RELATIONSHIP QUERIES (Advanced)
// ===========================================

// Products with distribution center info
db.products.aggregate([
  {
    $lookup: {
      from: "distributioncenters", // Note: MongoDB converts to lowercase
      localField: "distribution_center_id",
      foreignField: "id", 
      as: "distribution_center"
    }
  },
  { $limit: 3 },
  {
    $project: {
      name: 1,
      category: 1,
      retail_price: 1,
      "distribution_center.name": 1
    }
  }
])

// ===========================================
// 8. QUICK DEMO COMMANDS (Copy & Paste)
// ===========================================

/*
FOR QUICK DEMO - Copy these one by one:

1. Show collections:
show collections

2. Product categories:
db.products.aggregate([{$group: {_id: "$category", count: {$sum: 1}}}, {$sort: {count: -1}}])

3. Traffic sources:
db.users.aggregate([{$group: {_id: "$traffic_source", count: {$sum: 1}}}, {$sort: {count: -1}}])

4. Sample products:
db.products.find().limit(3).pretty()

5. Order status:
db.orders.aggregate([{$group: {_id: "$status", count: {$sum: 1}}}])
*/