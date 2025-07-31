import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api';

async function testDepartmentRefactoring() {
  console.log('🧪 Testing Department Refactoring Implementation');
  console.log('=' .repeat(50));

  try {
    // Test 1: Run Migration
    console.log('\n1️⃣ Running Department Migration...');
    const migrationResponse = await fetch(`${API_BASE}/admin/migrate-departments`, {
      method: 'POST'
    });
    const migrationResult = await migrationResponse.json();
    
    if (migrationResult.success) {
      console.log('✅ Migration successful!');
      console.log(`   Departments created: ${migrationResult.results.departmentsCreated}`);
      console.log(`   Products updated: ${migrationResult.results.productsUpdated}`);
      console.log(`   Total departments: ${migrationResult.results.totalDepartments}`);
    } else {
      console.log('❌ Migration failed:', migrationResult.message);
      return;
    }

    // Test 2: Get All Departments
    console.log('\n2️⃣ Testing Department API...');
    const deptResponse = await fetch(`${API_BASE}/departments?includeStats=true`);
    const departmentsData = await deptResponse.json();
    
    if (departmentsData.success) {
      console.log(`✅ Found ${departmentsData.total} departments:`);
      departmentsData.data.slice(0, 3).forEach(dept => {
        console.log(`   - ${dept.name}: ${dept.productCount || 0} products, avg price: $${dept.avgPrice || 0}`);
      });
    } else {
      console.log('❌ Department API failed');
    }

    // Test 3: Get Products with Department Info
    console.log('\n3️⃣ Testing Enhanced Products API...');
    const productsResponse = await fetch(`${API_BASE}/products?limit=5`);
    const productsData = await productsResponse.json();
    
    if (productsData.success) {
      console.log(`✅ Products API working. Sample products:`);
      productsData.data.slice(0, 3).forEach(product => {
        const deptInfo = product.department_id || product.departmentInfo;
        const deptName = deptInfo?.name || product.department || 'Unknown';
        console.log(`   - ${product.name}: Department: ${deptName}`);
      });
    } else {
      console.log('❌ Products API failed');
    }

    // Test 4: Department Filtering
    if (departmentsData.success && departmentsData.data.length > 0) {
      const testDept = departmentsData.data[0].name;
      console.log(`\n4️⃣ Testing Department Filtering (${testDept})...`);
      
      const filteredResponse = await fetch(`${API_BASE}/products?department=${encodeURIComponent(testDept)}&limit=3`);
      const filteredData = await filteredResponse.json();
      
      if (filteredData.success) {
        console.log(`✅ Department filtering works. Found ${filteredData.pagination.totalItems} products in ${testDept}`);
        if (filteredData.data.length > 0) {
          console.log(`   Sample: ${filteredData.data[0].name}`);
        }
      } else {
        console.log('❌ Department filtering failed');
      }
    }

    // Test 5: Single Product with Department Info
    if (productsData.success && productsData.data.length > 0) {
      const testProductId = productsData.data[0]._id;
      console.log(`\n5️⃣ Testing Single Product API...`);
      
      const singleProductResponse = await fetch(`${API_BASE}/products/${testProductId}`);
      const singleProductData = await singleProductResponse.json();
      
      if (singleProductData.success) {
        const product = singleProductData.data;
        const deptInfo = product.department_id || product.departmentInfo;
        console.log(`✅ Single product API works:`);
        console.log(`   Product: ${product.name}`);
        console.log(`   Department: ${deptInfo?.name || product.department || 'Unknown'}`);
      } else {
        console.log('❌ Single product API failed');
      }
    }

    console.log('\n🎉 All tests completed!');
    console.log('=' .repeat(50));

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Run tests if server is available
console.log('⏳ Waiting for server to be ready...');
setTimeout(() => {
  testDepartmentRefactoring();
}, 2000);

export default testDepartmentRefactoring;
