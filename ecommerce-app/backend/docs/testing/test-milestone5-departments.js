/**
 * MILESTONE 5: Departments API Testing Suite
 * 
 * Tests all required department endpoints:
 * - GET /api/departments - List all departments
 * - GET /api/departments/{id} - Get specific department details
 * - GET /api/departments/{id}/products - Get all products in a department
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// API base URL
const BASE_URL = 'http://localhost:3000';

// Test utilities
const makeRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      data
    };
  } catch (error) {
    console.error(`❌ Request failed for ${endpoint}:`, error.message);
    return {
      status: 500,
      ok: false,
      error: error.message
    };
  }
};

const logTestResult = (testName, passed, details = '') => {
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${testName}`);
  if (details) {
    console.log(`   ${details}`);
  }
};

// Test suite
const runTests = async () => {
  console.log('🧪 Starting Milestone 5 - Departments API Testing Suite\n');
  
  let totalTests = 0;
  let passedTests = 0;
  let departmentId = null; // Will be set from the first test

  // Test 1: GET /api/departments - List all departments
  console.log('📋 Test 1: GET /api/departments - List all departments');
  totalTests++;
  
  try {
    const response = await makeRequest('/api/departments');
    
    if (response.ok && response.data.success) {
      const { departments, total } = response.data;
      
      // Validate response structure
      const hasCorrectStructure = Array.isArray(departments) && 
                                 typeof total === 'number' &&
                                 departments.length > 0;
      
      // Validate department objects have required fields
      const firstDept = departments[0];
      const hasRequiredFields = firstDept.id && 
                               firstDept.name && 
                               typeof firstDept.product_count === 'number';
      
      if (hasCorrectStructure && hasRequiredFields) {
        passedTests++;
        departmentId = firstDept.id || firstDept._id; // Store for later tests
        logTestResult('Departments list retrieved successfully', true, 
                     `Found ${total} departments, first dept: "${firstDept.name}" with ${firstDept.product_count} products`);
      } else {
        logTestResult('Invalid response structure', false, 
                     'Missing required fields: id, name, product_count');
      }
    } else {
      logTestResult('API request failed', false, 
                   `Status: ${response.status}, Error: ${response.data?.error}`);
    }
  } catch (error) {
    logTestResult('Test execution failed', false, error.message);
  }

  console.log();

  // Test 2: GET /api/departments/{id} - Get specific department details
  console.log('🔍 Test 2: GET /api/departments/{id} - Get specific department details');
  totalTests++;

  if (departmentId) {
    try {
      const response = await makeRequest(`/api/departments/${departmentId}`);
      
      if (response.ok && response.data.success) {
        const department = response.data.data;
        
        // Validate response structure
        const hasRequiredFields = department.name && 
                                 department.description !== undefined &&
                                 typeof department.productCount === 'number' &&
                                 department.avgPrice !== undefined;
        
        if (hasRequiredFields) {
          passedTests++;
          logTestResult('Department details retrieved successfully', true,
                       `Department: "${department.name}", Products: ${department.productCount}, Avg Price: $${department.avgPrice}`);
        } else {
          logTestResult('Invalid department details structure', false,
                       'Missing required fields: name, productCount, avgPrice');
        }
      } else {
        logTestResult('Department details request failed', false,
                     `Status: ${response.status}, Error: ${response.data?.error}`);
      }
    } catch (error) {
      logTestResult('Test execution failed', false, error.message);
    }
  } else {
    logTestResult('Skipped - no department ID available', false, 
                 'Previous test failed to provide department ID');
  }

  console.log();

  // Test 3: GET /api/departments/{id}/products - Get products in department
  console.log('📦 Test 3: GET /api/departments/{id}/products - Get products in department');
  totalTests++;

  if (departmentId) {
    try {
      const response = await makeRequest(`/api/departments/${departmentId}/products?limit=5`);
      
      if (response.ok && response.data.success) {
        const { department, products, pagination } = response.data;
        
        // Validate response structure
        const hasCorrectStructure = typeof department === 'string' &&
                                   Array.isArray(products) &&
                                   pagination && 
                                   typeof pagination.totalItems === 'number';
        
        if (hasCorrectStructure) {
          passedTests++;
          logTestResult('Department products retrieved successfully', true,
                       `Department: "${department}", Products: ${products.length}/${pagination.totalItems}, Page: ${pagination.currentPage}/${pagination.totalPages}`);
        } else {
          logTestResult('Invalid department products structure', false,
                       'Missing required fields: department, products, pagination');
        }
      } else {
        logTestResult('Department products request failed', false,
                     `Status: ${response.status}, Error: ${response.data?.error}`);
      }
    } catch (error) {
      logTestResult('Test execution failed', false, error.message);
    }
  } else {
    logTestResult('Skipped - no department ID available', false,
                 'Previous test failed to provide department ID');
  }

  console.log();

  // Test 4: Error handling - Invalid department ID
  console.log('⚠️  Test 4: Error handling - Invalid department ID');
  totalTests++;

  try {
    const invalidId = '507f1f77bcf86cd799439011'; // Valid ObjectId format but non-existent
    const response = await makeRequest(`/api/departments/${invalidId}`);
    
    if (response.status === 404 && !response.data.success) {
      passedTests++;
      logTestResult('404 error handled correctly', true,
                   'Non-existent department returns 404 as expected');
    } else {
      logTestResult('Invalid error handling', false,
                   `Expected 404, got ${response.status}`);
    }
  } catch (error) {
    logTestResult('Test execution failed', false, error.message);
  }

  console.log();

  // Test 5: Error handling - Invalid ObjectId format
  console.log('⚠️  Test 5: Error handling - Invalid ObjectId format');
  totalTests++;

  try {
    const invalidId = 'invalid-id-format';
    const response = await makeRequest(`/api/departments/${invalidId}`);
    
    if (response.status === 400 && !response.data.success) {
      passedTests++;
      logTestResult('400 error handled correctly', true,
                   'Invalid ObjectId format returns 400 as expected');
    } else {
      logTestResult('Invalid error handling', false,
                   `Expected 400, got ${response.status}`);
    }
  } catch (error) {
    logTestResult('Test execution failed', false, error.message);
  }

  console.log();

  // Test 6: Pagination testing
  console.log('📄 Test 6: Pagination testing - Department products with different limits');
  totalTests++;

  if (departmentId) {
    try {
      const [page1Response, page2Response] = await Promise.all([
        makeRequest(`/api/departments/${departmentId}/products?page=1&limit=2`),
        makeRequest(`/api/departments/${departmentId}/products?page=2&limit=2`)
      ]);
      
      if (page1Response.ok && page2Response.ok) {
        const page1Data = page1Response.data;
        const page2Data = page2Response.data;
        
        const validPagination = page1Data.pagination.currentPage === 1 &&
                               page2Data.pagination.currentPage === 2 &&
                               page1Data.products.length <= 2 &&
                               page2Data.products.length <= 2;
        
        if (validPagination) {
          passedTests++;
          logTestResult('Pagination working correctly', true,
                       `Page 1: ${page1Data.products.length} products, Page 2: ${page2Data.products.length} products`);
        } else {
          logTestResult('Pagination not working correctly', false,
                       'Page numbers or product counts incorrect');
        }
      } else {
        logTestResult('Pagination requests failed', false,
                     'One or both pagination requests failed');
      }
    } catch (error) {
      logTestResult('Test execution failed', false, error.message);
    }
  } else {
    logTestResult('Skipped - no department ID available', false,
                 'Previous test failed to provide department ID');
  }

  console.log();

  // Test 7: Performance test - Large department query
  console.log('⚡ Test 7: Performance test - Large department query');
  totalTests++;

  if (departmentId) {
    try {
      const startTime = Date.now();
      const response = await makeRequest(`/api/departments/${departmentId}/products?limit=100`);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (response.ok && responseTime < 5000) { // Should respond within 5 seconds
        passedTests++;
        logTestResult('Performance test passed', true,
                     `Response time: ${responseTime}ms (< 5000ms threshold)`);
      } else {
        logTestResult('Performance test failed', false,
                     `Response time: ${responseTime}ms (>= 5000ms threshold) or request failed`);
      }
    } catch (error) {
      logTestResult('Test execution failed', false, error.message);
    }
  } else {
    logTestResult('Skipped - no department ID available', false,
                 'Previous test failed to provide department ID');
  }

  console.log();

  // Test Summary
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! Milestone 5 Departments API is ready for production.');
  } else {
    console.log('⚠️  Some tests failed. Please review and fix the issues above.');
  }

  console.log('\n🏁 Testing complete!');
};

// Example usage demonstrating the API
const demonstrateAPI = async () => {
  console.log('\n📋 API USAGE EXAMPLES');
  console.log('='.repeat(50));

  // Example 1: Get all departments
  console.log('\n1. Get all departments:');
  console.log('   GET /api/departments');
  console.log('   Response format:');
  console.log(`   {
     "success": true,
     "departments": [
       {
         "id": "ObjectId",
         "name": "Electronics",
         "product_count": 25,
         "description": "Electronic items"
       }
     ],
     "total": 6
   }`);

  // Example 2: Get specific department
  console.log('\n2. Get specific department details:');
  console.log('   GET /api/departments/{id}');
  console.log('   Response format:');
  console.log(`   {
     "success": true,
     "data": {
       "name": "Electronics",
       "description": "Electronic items",
       "productCount": 25,
       "avgPrice": 45.67,
       "minPrice": 9.99,
       "maxPrice": 199.99,
       "topBrands": [
         {"brand": "Samsung", "count": 8},
         {"brand": "Apple", "count": 6}
       ]
     }
   }`);

  // Example 3: Get department products
  console.log('\n3. Get products in a department:');
  console.log('   GET /api/departments/{id}/products?page=1&limit=10');
  console.log('   Response format:');
  console.log(`   {
     "success": true,
     "department": "Electronics",
     "products": [...],
     "pagination": {
       "currentPage": 1,
       "totalPages": 3,
       "totalItems": 25,
       "itemsPerPage": 10
     }
   }`);
};

// Run the tests
if (import.meta.url === new URL(import.meta).href) {
  runTests()
    .then(() => demonstrateAPI())
    .catch(error => {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    });
}

export { runTests, demonstrateAPI };
