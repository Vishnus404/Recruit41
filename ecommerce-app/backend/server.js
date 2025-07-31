import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' })); // Add payload size limit
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`📡 ${timestamp} - ${req.method} ${req.url}`);
  
  // Log query parameters for GET requests
  if (req.method === 'GET' && Object.keys(req.query).length > 0) {
    console.log(`   Query params:`, req.query);
  }
  
  next();
});

// JSON parsing error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON',
      message: 'Request body contains invalid JSON'
    });
  }
  next(err);
});

// CORS middleware (if needed for frontend integration)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔌 Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Import models for API routes (optional)
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import OrderItem from './models/OrderItem.js';
import InventoryItem from './models/InventoryItem.js';
import DistributionCenter from './models/Distribution.js';
import Department from './models/Department.js';

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'E-commerce API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime()
  });
});

// ===========================================
// 🛍️ PRODUCTS REST API - Milestone 2
// ===========================================

// GET /api/products - List all products with pagination
app.get('/api/products', async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const brand = req.query.brand;
    const department = req.query.department;
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const search = req.query.search;

    // Validate pagination parameters with more specific errors
    if (page < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid page parameter',
        message: 'Page must be a positive integer (≥ 1)'
      });
    }
    
    if (limit < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid limit parameter',
        message: 'Limit must be a positive integer (≥ 1)'
      });
    }
    
    if (limit > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid limit parameter',
        message: 'Limit cannot exceed 100 items per page'
      });
    }

    // Validate price parameters
    if (minPrice && (isNaN(minPrice) || minPrice < 0)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid minPrice parameter',
        message: 'minPrice must be a positive number'
      });
    }

    if (maxPrice && (isNaN(maxPrice) || maxPrice < 0)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid maxPrice parameter', 
        message: 'maxPrice must be a positive number'
      });
    }

    if (minPrice && maxPrice && minPrice > maxPrice) {
      return res.status(400).json({
        success: false,
        error: 'Invalid price range',
        message: 'minPrice cannot be greater than maxPrice'
      });
    }

    // Build filter object
    const filter = {};
    if (category) filter.category = new RegExp(category, 'i');
    if (brand) filter.brand = new RegExp(brand, 'i');
    
    // Support both old department string and new department_id filtering
    if (department) {
      // Try to find department by name first (for new structure)
      const departmentDoc = await Department.findOne({ name: new RegExp(department, 'i') });
      if (departmentDoc) {
        filter.department_id = departmentDoc._id;
      } else {
        // Fallback to old department string filtering
        filter.department = new RegExp(department, 'i');
      }
    }
    
    if (minPrice || maxPrice) {
      filter.retail_price = {};
      if (minPrice) filter.retail_price.$gte = minPrice;
      if (maxPrice) filter.retail_price.$lte = maxPrice;
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') }
      ];
    }

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Execute queries
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('department_id', 'name description isActive') // Populate department info
        .select('-__v -createdAt -updatedAt') // Exclude internal fields
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // Format response
    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNext,
        hasPrev
      },
      filters: {
        category,
        brand, 
        department,
        minPrice,
        maxPrice,
        search
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch products'
    });
  }
});

// GET /api/products/categories - Get all product categories
app.get('/api/products/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      // Filter out null/empty categories
      { 
        $match: { 
          category: { $exists: true, $ne: null, $ne: "" } 
        } 
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$retail_price' }
        }
      },
      {
        $project: {
          _id: 1, // Keep _id (which contains the category name)
          count: 1,
          avgPrice: { $round: ['$avgPrice', 2] }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 50 } // Limit to top 50 categories
    ]);

    console.log('Categories found:', categories.length); // Debug log
    console.log('Sample categories:', categories.slice(0, 3)); // Debug log

    res.json({
      success: true,
      data: categories,
      total: categories.length
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch product categories'
    });
  }
});

// GET /api/products/brands - Get all product brands
app.get('/api/products/brands', async (req, res) => {
  try {
    const brands = await Product.aggregate([
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 },
          avgPrice: { $avg: '$retail_price' }
        }
      },
      {
        $project: {
          brand: '$_id',
          count: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
          _id: 0
        }
      },
      { $sort: { count: -1 } },
      { $limit: 50 } // Limit to top 50 brands
    ]);

    res.json({
      success: true,
      data: brands,
      total: brands.length
    });

  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch product brands'
    });
  }
});

// Get all departments
app.get('/api/departments', async (req, res) => {
  try {
    const includeStats = req.query.includeStats !== 'false'; // Default to true

    if (includeStats) {
      // Get departments with product statistics (default)
      const departments = await Department.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'department_id',
            as: 'products'
          }
        },
        {
          $project: {
            id: '$_id', // Add id field as required by spec
            _id: 1,
            name: 1,
            description: 1,
            isActive: 1,
            createdAt: 1,
            updatedAt: 1,
            product_count: { $size: '$products' }, // Use product_count as per spec
            avgPrice: { 
              $round: [{ $avg: '$products.retail_price' }, 2] 
            }
          }
        },
        { $sort: { name: 1 } }
      ]);

      res.json({
        success: true,
        departments: departments, // Use 'departments' key as per spec
        total: departments.length
      });
    } else {
      // Get simple department list without stats
      const departments = await Department.find({ isActive: true })
        .select('name description isActive')
        .sort({ name: 1 });

      // Add product_count: 0 to maintain consistency
      const departmentsWithCount = departments.map(dept => ({
        id: dept._id,
        _id: dept._id,
        name: dept.name,
        description: dept.description,
        isActive: dept.isActive,
        product_count: 0
      }));

      res.json({
        success: true,
        departments: departmentsWithCount,
        total: departmentsWithCount.length
      });
    }

  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch departments'
    });
  }
});

// Get specific department details
app.get('/api/departments/:id', async (req, res) => {
  try {
    const departmentId = req.params.id;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid department ID',
        message: 'Department ID must be a valid MongoDB ObjectId'
      });
    }

    // Get basic department info first
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found',
        message: `Department with ID ${departmentId} does not exist`
      });
    }

    // Get product statistics using separate aggregation
    const productStats = await Product.aggregate([
      {
        $match: { department_id: new mongoose.Types.ObjectId(departmentId) }
      },
      {
        $group: {
          _id: null,
          productCount: { $sum: 1 },
          avgPrice: { $avg: '$retail_price' },
          minPrice: { $min: '$retail_price' },
          maxPrice: { $max: '$retail_price' }
        }
      }
    ]);

    // Get top brands using separate aggregation
    const topBrandsData = await Product.aggregate([
      {
        $match: { 
          department_id: new mongoose.Types.ObjectId(departmentId),
          brand: { $ne: null, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          brand: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Prepare response data
    const stats = productStats.length > 0 ? productStats[0] : {
      productCount: 0,
      avgPrice: 0,
      minPrice: 0,
      maxPrice: 0
    };

    const response = {
      _id: department._id,
      name: department.name,
      description: department.description,
      isActive: department.isActive,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
      productCount: stats.productCount,
      avgPrice: Math.round((stats.avgPrice || 0) * 100) / 100,
      minPrice: stats.minPrice || 0,
      maxPrice: stats.maxPrice || 0,
      topBrands: topBrandsData || []
    };

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error fetching department details:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch department details'
    });
  }
});

// Get products by department
app.get('/api/departments/:id/products', async (req, res) => {
  try {
    const departmentId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found',
        message: `Department with ID ${departmentId} does not exist`
      });
    }

    // Get products in this department
    const [products, total] = await Promise.all([
      Product.find({ department_id: departmentId })
        .populate('department_id', 'name description')
        .select('-__v -createdAt -updatedAt')
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments({ department_id: departmentId })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      department: department.name, // Use department name as per spec
      departmentInfo: {
        id: department._id,
        name: department.name,
        description: department.description,
        isActive: department.isActive,
        product_count: total
      },
      products: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching department products:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch department products'
    });
  }
});

// DEBUG: Sample products endpoint to check data quality
app.get('/api/debug/sample-products', async (req, res) => {
  try {
    const sampleProducts = await Product.find({})
      .populate('department_id', 'name description')
      .select('name category brand department department_id retail_price')
      .limit(10);
    
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          nullCategories: { 
            $sum: { 
              $cond: [{ $or: [{ $eq: ['$category', null] }, { $eq: ['$category', ''] }] }, 1, 0] 
            } 
          },
          validCategories: { 
            $sum: { 
              $cond: [{ $and: [{ $ne: ['$category', null] }, { $ne: ['$category', ''] }] }, 1, 0] 
            } 
          }
        }
      }
    ]);

    res.json({
      success: true,
      sampleProducts,
      stats: categoryStats[0] || { totalProducts: 0, nullCategories: 0, validCategories: 0 }
    });

  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Debug endpoint failed'
    });
  }
});

// GET /api/products/:id - Get a specific product by ID (MUST come after specific routes)
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format (for MongoDB ObjectId)
    if (!id || id.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID',
        message: 'Product ID is required'
      });
    }

    // Try to find by custom ID first, then by MongoDB _id
    let product = await Product.findOne({ id: id })
      .populate('department_id', 'name description isActive')
      .select('-__v -createdAt -updatedAt');
    
    // If not found by custom ID, try MongoDB _id (if it looks like ObjectId)
    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id)
        .populate('department_id', 'name description isActive')
        .select('-__v -createdAt -updatedAt');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `No product found with ID: ${id}`
      });
    }

    // Calculate profit margin
    const profitMargin = product.retail_price - product.cost;
    const profitPercentage = ((profitMargin / product.cost) * 100).toFixed(2);

    // Enhanced product response
    res.json({
      success: true,
      data: {
        ...product.toObject(),
        profitMargin: parseFloat(profitMargin.toFixed(2)),
        profitPercentage: parseFloat(profitPercentage)
      }
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format',
        message: 'The provided ID is not in a valid format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch product details'
    });
  }
});

// ===========================================
// 👥 USERS & ORDERS APIs (existing)
// ===========================================

app.get('/api/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-__v -createdAt -updatedAt')
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .select('-__v -createdAt -updatedAt')
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments();

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Unhandled Error:', err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.message,
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      message: 'The provided ID is not in a valid format'
    });
  }
  
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'Duplicate entry',
      message: 'Resource already exists'
    });
  }
  
  // Default server error
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong on our end' 
      : err.message
  });
});

// Enhanced 404 handler
// Migration endpoint to setup departments (for development/deployment)
app.post('/api/admin/migrate-departments', async (req, res) => {
  try {
    console.log('🚀 Starting Department Migration via API...');

    // Step 1: Get unique department names
    const uniqueDepartments = await Product.distinct('department');
    console.log(`Found ${uniqueDepartments.length} unique departments`);

    // Step 2: Create departments
    const departmentMap = new Map();
    let departmentsCreated = 0;
    
    for (const deptName of uniqueDepartments) {
      if (!deptName || deptName.trim() === '') continue;

      let department = await Department.findOne({ name: deptName.trim() });
      
      if (!department) {
        department = new Department({
          name: deptName.trim(),
          description: `${deptName.trim()} department`,
          isActive: true
        });
        await department.save();
        departmentsCreated++;
        console.log(`✅ Created department: ${department.name}`);
      }
      
      departmentMap.set(deptName.trim(), department._id);
    }

    // Step 3: Update products
    let productsUpdated = 0;
    
    for (const [deptName, deptId] of departmentMap) {
      const result = await Product.updateMany(
        { department: deptName, department_id: { $exists: false } },
        { $set: { department_id: deptId } }
      );
      productsUpdated += result.modifiedCount;
    }

    // Verification
    const withDeptId = await Product.countDocuments({ department_id: { $exists: true } });
    const withoutDeptId = await Product.countDocuments({ 
      department_id: { $exists: false },
      department: { $exists: true, $ne: null, $ne: '' }
    });

    console.log('🎉 Migration completed via API!');

    res.json({
      success: true,
      message: 'Department migration completed successfully',
      results: {
        departmentsCreated,
        productsUpdated,
        productsWithDeptId: withDeptId,
        productsWithoutDeptId: withoutDeptId,
        totalDepartments: departmentMap.size
      }
    });

  } catch (error) {
    console.error('❌ Migration error:', error);
    res.status(500).json({
      success: false,
      error: 'Migration failed',
      message: error.message
    });
  }
});

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: {
      products: '/api/products',
      departments: '/api/departments',
      health: '/health',
      migration: 'POST /api/admin/migrate-departments',
      root: '/'
    }
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔌 Disconnecting from MongoDB...');
  await mongoose.disconnect();
  console.log('👋 Server shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
