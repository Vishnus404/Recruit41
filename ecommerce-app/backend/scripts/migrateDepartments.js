import mongoose from 'mongoose';
import Department from '../models/Department.js';
import Product from '../models/Product.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected for migration');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migration script to refactor departments
const migrateDepartments = async () => {
  try {
    console.log('🚀 Starting Department Migration...');

    // Step 1: Get unique department names from products
    console.log('📊 Extracting unique department names...');
    const uniqueDepartments = await Product.distinct('department');
    console.log(`Found ${uniqueDepartments.length} unique departments:`, uniqueDepartments);

    // Step 2: Create departments in the new table
    console.log('🏗️ Creating department records...');
    const departmentMap = new Map();
    
    for (const deptName of uniqueDepartments) {
      if (!deptName || deptName.trim() === '') {
        console.log('⚠️ Skipping empty department name');
        continue;
      }

      // Check if department already exists
      let department = await Department.findOne({ name: deptName.trim() });
      
      if (!department) {
        department = new Department({
          name: deptName.trim(),
          description: `${deptName.trim()} department`,
          isActive: true
        });
        await department.save();
        console.log(`✅ Created department: ${department.name}`);
      } else {
        console.log(`📝 Department already exists: ${department.name}`);
      }
      
      departmentMap.set(deptName.trim(), department._id);
    }

    // Step 3: Update products to use department_id
    console.log('🔄 Updating products with department_id...');
    let updatedCount = 0;
    const batchSize = 1000;
    
    // Get total count for progress tracking
    const totalProducts = await Product.countDocuments();
    console.log(`Total products to update: ${totalProducts}`);
    
    for (let skip = 0; skip < totalProducts; skip += batchSize) {
      const products = await Product.find({})
        .select('_id department department_id')
        .skip(skip)
        .limit(batchSize)
        .lean();

      const bulkOps = [];
      
      for (const product of products) {
        if (product.department && !product.department_id) {
          const departmentId = departmentMap.get(product.department.trim());
          
          if (departmentId) {
            bulkOps.push({
              updateOne: {
                filter: { _id: product._id },
                update: { 
                  $set: { department_id: departmentId }
                }
              }
            });
          }
        }
      }

      if (bulkOps.length > 0) {
        const result = await Product.bulkWrite(bulkOps);
        updatedCount += result.modifiedCount;
        console.log(`📈 Progress: ${Math.min(skip + batchSize, totalProducts)}/${totalProducts} products processed. Updated: ${updatedCount}`);
      }
    }

    console.log(`✅ Successfully updated ${updatedCount} products with department_id`);

    // Step 4: Verify the migration
    console.log('🔍 Verifying migration...');
    const productsWithoutDeptId = await Product.countDocuments({ 
      department_id: { $exists: false },
      department: { $exists: true, $ne: null, $ne: '' }
    });
    
    const productsWithDeptId = await Product.countDocuments({ 
      department_id: { $exists: true } 
    });

    console.log(`Products with department_id: ${productsWithDeptId}`);
    console.log(`Products without department_id (but with department): ${productsWithoutDeptId}`);

    // Step 5: Show sample of migrated data
    console.log('📋 Sample of migrated products:');
    const sampleProducts = await Product.find({})
      .populate('department_id', 'name description')
      .limit(5)
      .select('name department department_id');
    
    sampleProducts.forEach(product => {
      console.log(`- ${product.name}: ${product.department} → ${product.department_id?.name || 'No department_id'}`);
    });

    console.log('🎉 Department migration completed successfully!');
    
    return {
      departmentsCreated: departmentMap.size,
      productsUpdated: updatedCount,
      productsWithoutDeptId,
      productsWithDeptId
    };

  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
};

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      await connectDB();
      const result = await migrateDepartments();
      console.log('📊 Migration Summary:', result);
      process.exit(0);
    } catch (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
  })();
}

export { migrateDepartments, connectDB };
