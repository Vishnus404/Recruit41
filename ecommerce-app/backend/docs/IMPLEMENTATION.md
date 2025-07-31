# API Implementation Walkthrough

This document explains the key design decisions and code structure of the E-commerce backend API.

## 1. API Framework Choice and Setup

- **Framework**: [Express.js](https://expressjs.com/) – a lightweight, unopinionated web framework for Node.js.
- **Why Express?**
  - Minimal boilerplate, easy to extend with middleware.
  - Large ecosystem and community support.
  - Excellent for building RESTful APIs with clear routing.

### Project Initialization
```bash
npm init -y
npm install express mongoose dotenv cors
```
- **`dotenv`** loads environment variables from `.env`.
- **`mongoose`** is used for MongoDB ODM (object data modeling).
- **Custom middleware** for CORS, JSON parsing, and logging is configured in `server.js`.

## 2. Database Connection and Query Logic

### Connection Setup
```js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔌 Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
```
- Exits the process if MongoDB is unreachable to prevent serving a broken API.
- Connection status is available in `/health` endpoint.

### Query Logic
- **Pagination & Filtering** (`GET /api/products`):
  - Parse `page`, `limit`, `category`, `brand`, `department`, `minPrice`, `maxPrice`, `search` from `req.query`.
  - Validate parameters, build a `filter` object with Mongoose query operators (`$gte`, `$lte`, regex for text search).
  - Use `Product.find(filter).skip(skip).limit(limit)` and `Product.countDocuments(filter)` in parallel (`Promise.all`).

- **Aggregation**:
  - **Categories** (`/api/products/categories`): `Product.aggregate()` with `$group`, `$project`, `$sort`.
  - **Brands** (`/api/products/brands`): similar aggregation, with `$limit` to top 50.

- **Single Document Lookup** (`GET /api/products/:id`):
  - Validate `id` param length and format.
  - Try custom `id` field, then fallback to MongoDB `_id`.
  - Calculate `profitMargin` and `profitPercentage` on the retrieved document.

## 3. Error Handling Implementation

### Route-Level Try/Catch
```js
app.get('/api/products', async (req, res) => {
  try {
    // query logic...
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
```
- Catches unexpected runtime errors and returns HTTP 500.

### JSON Parsing Errors
```js
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ success: false, error: 'Invalid JSON' });
  }
  next(err);
});
```
- Returns HTTP 400 when JSON parsing fails.

### Enhanced Global Error Middleware
```js
app.use((err, req, res, next) => {
  console.error('🚨 Unhandled Error:', err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: 'Validation Error', details: ... });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, error: 'Duplicate entry' });
  }

  res.status(500).json({ success: false, error: 'Internal server error' });
});
```
- Differentiates common Mongo/Mongoose errors.
- Returns appropriate HTTP codes: 400, 409, 500.

### 404 Handler
```js
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found', message: `Cannot ${req.method} ${req.originalUrl}` });
});
```
- Catches all undefined routes and returns 404 with request info.

## 4. Response Formatting and HTTP Status Codes

- All responses follow a consistent JSON schema:
  ```json
  {
    "success": true|false,
    "data": ...,       // on success
    "error": "...",  // on failure
    "message": "..." // optional human-friendly message
  }
  ```
- **Status Codes**:
  - **200 OK**: Successful GET, data returned.
  - **201 Created**: Successful resource creation (e.g., POST).
  - **400 Bad Request**: Validation errors, invalid parameters, malformed JSON.
  - **404 Not Found**: Missing resource or unknown route.
  - **409 Conflict**: Duplicate key errors (Mongo 11000).
  - **500 Internal Server Error**: Unexpected server failures.

---

*End of Implementation Walkthrough*
