# E-commerce Backend API

A Node.js/Express backend application for managing e-commerce data with MongoDB integration.

## 🚀 Features

- **RESTful API** with Express.js
- **MongoDB** integration with Mongoose
- **CSV Data Import** for bulk data loading
- **Robust Error Handling** and validation
- **Data Models** for Users, Products, Orders, Inventory, and Distribution Centers
- **Health Check** endpoints
- **CORS** support for frontend integration

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** running locally or a MongoDB connection string
- **npm** package manager

## 🛠️ Installation

1. **Clone the repository** (if applicable)
2. **Navigate to the project directory:**
   ```bash
   cd ecommerce-app/backend/ecommerce-app
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   - The `.env` file is already configured with:
     ```
     MONGO_URI=mongodb://localhost:27017/ecommerce
     ```
   - Modify the MongoDB URI if needed

## 🗄️ Database Setup

### Start MongoDB
Make sure MongoDB is running on your system:
- **Windows:** Start MongoDB service
- **macOS:** `brew services start mongodb-community`
- **Linux:** `sudo systemctl start mongod`

### Load Sample Data
Load all CSV data into MongoDB:
```bash
npm run load:all
```

This will import data from:
- `data/distribution_centers.csv`
- `data/products.csv`
- `data/inventory_items.csv`
- `data/users.csv`
- `data/orders.csv`
- `data/order_items.csv`

## 🚀 Running the Application

### Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in PORT environment variable).

### API Endpoints

#### Health Check
- **GET** `/health` - Check server and database status
- **GET** `/` - Basic API information

#### Data Endpoints
- **GET** `/api/users` - Get first 10 users
- **GET** `/api/products` - Get first 10 products
- **GET** `/api/orders` - Get first 10 orders

## 📊 Data Models

### User
- `id`, `first_name`, `last_name`, `email`, `age`, `gender`
- `state`, `city`, `country`, `latitude`, `longitude`
- `traffic_source`, `created_at`

### Product
- `id`, `cost`, `category`, `name`, `brand`, `retail_price`
- `department`, `sku`, `distribution_center_id`

### Order
- `order_id`, `user_id`, `status`, `gender`, `num_of_item`
- `created_at`, `shipped_at`, `delivered_at`, `returned_at`

### Order Item
- `id`, `order_id`, `user_id`, `product_id`, `inventory_item_id`
- `status`, `created_at`, `shipped_at`, `delivered_at`, `returned_at`

### Inventory Item
- `id`, `product_id`, `cost`, `created_at`, `sold_at`
- Product details (denormalized)

### Distribution Center
- `id`, `name`, `latitude`, `longitude`

## 🔧 Scripts

- `npm start` - Start the server
- `npm run load:all` - Load all CSV data into MongoDB

## 🐛 Bug Fixes Applied

The following critical issues have been resolved:

1. ✅ **Created missing server.js file**
2. ✅ **Fixed model import paths**
3. ✅ **Added comprehensive error handling**
4. ✅ **Implemented absolute file paths for CSV loading**
5. ✅ **Added schema validation and indexes**
6. ✅ **Improved logging and progress tracking**
7. ✅ **Added proper data validation**
8. ✅ **Enhanced error recovery**

## 📝 Error Handling

The application includes comprehensive error handling:
- **Database connection** errors
- **File not found** errors for CSV files
- **Data validation** errors
- **Malformed CSV** data handling
- **Graceful shutdown** on SIGINT

## 🔍 Monitoring

- Health check endpoint at `/health`
- Detailed logging for all operations
- Progress tracking during data imports
- Database connection status monitoring

## 🛡️ Data Validation

All models include:
- **Required field** validation
- **Data type** validation
- **Custom validators** for email, age, coordinates
- **Enum constraints** for status fields
- **Unique constraints** for IDs and emails
- **Database indexes** for performance

## 🤝 Contributing

When adding new features:
1. Add proper error handling
2. Include data validation
3. Add appropriate indexes
4. Update this README

## 📄 License

This project is for educational/demonstration purposes.
