import mongoose from 'mongoose';
import Department from '../models/Department.js';
import Product from '../models/Product.js';

console.log('🚀 Starting Department Migration...');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    try {
      // Step 1: Get unique department names
      console.log('📊 Extracting unique department names...');
      const uniqueDepartments = await Product.distinct('department');
      console.log(`Found ${uniqueDepartments.length} unique departments:`, uniqueDepartments);

      // Step 2: Create departments
      console.log('🏗️ Creating department records...');
      const departmentMap = new Map();
      
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
          console.log(`✅ Created department: ${department.name}`);
        }
        
        departmentMap.set(deptName.trim(), department._id);
      }

      // Step 3: Update products (in smaller batches)
      console.log('🔄 Updating products with department_id...');
      let updated = 0;
      
      for (const [deptName, deptId] of departmentMap) {
        const result = await Product.updateMany(
          { department: deptName, department_id: { $exists: false } },
          { $set: { department_id: deptId } }
        );
        updated += result.modifiedCount;
        console.log(`Updated ${result.modifiedCount} products for ${deptName}`);
      }

      console.log(`✅ Successfully updated ${updated} products`);
      
      // Verification
      const withDeptId = await Product.countDocuments({ department_id: { $exists: true } });
      const withoutDeptId = await Product.countDocuments({ 
        department_id: { $exists: false },
        department: { $exists: true, $ne: null, $ne: '' }
      });
      
      console.log(`Products with department_id: ${withDeptId}`);
      console.log(`Products without department_id: ${withoutDeptId}`);
      console.log('🎉 Migration completed!');
      
    } catch (error) {
      console.error('❌ Migration error:', error);
    }
    
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Connection error:', error);
    process.exit(1);
  });
