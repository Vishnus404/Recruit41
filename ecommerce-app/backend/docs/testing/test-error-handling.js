#!/usr/bin/env node

// 🚨 Comprehensive Error Handling Test Script (Node.js)
// Tests all error scenarios and edge cases for the E-commerce API

import fetch from 'node-fetch'; // You might need: npm install node-fetch
import fs from 'fs';

const baseUrl = 'http://localhost:3000';
const testResults = [];

console.log('🚨 COMPREHENSIVE ERROR HANDLING TESTS (Node.js)');
console.log('================================================');
console.log('');

async function testEndpoint(testName, url, expectedStatus, expectedError = null) {
    console.log(`🧪 Testing: ${testName}`);
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.status === expectedStatus) {
            console.log(`   ✅ SUCCESS - Got expected status ${response.status}`);
            
            if (expectedError && (data.error?.includes(expectedError) || data.message?.includes(expectedError))) {
                console.log(`   ✅ SUCCESS - Error message contains expected text`);
                testResults.push({ test: testName, status: 'PASSED', statusCode: response.status });
            } else if (expectedError) {
                console.log(`   ⚠️  WARNING - Status correct but error message unexpected`);
                console.log(`   Expected: ${expectedError}`);
                console.log(`   Got: ${data.error} / ${data.message}`);
                testResults.push({ test: testName, status: 'PARTIAL', statusCode: response.status });
            } else {
                testResults.push({ test: testName, status: 'PASSED', statusCode: response.status });
            }
        } else {
            console.log(`   ❌ FAILED - Expected ${expectedStatus} but got ${response.status}`);
            console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
            testResults.push({ test: testName, status: 'FAILED', expected: expectedStatus, actual: response.status });
        }
    } catch (error) {
        console.log(`   ❌ ERROR - Network or parsing error: ${error.message}`);
        testResults.push({ test: testName, status: 'ERROR', error: error.message });
    }
    
    console.log('');
}

async function runTests() {
    try {
        // Check if server is running
        console.log('🔍 Checking if server is running...');
        const healthCheck = await fetch(`${baseUrl}/health`);
        if (!healthCheck.ok) {
            throw new Error('Server health check failed');
        }
        console.log('✅ Server is running\n');

        // ===========================================
        // 1. PAGINATION ERROR TESTS
        // ===========================================
        console.log('📄 PAGINATION ERROR TESTS');
        console.log('===========================');

        await testEndpoint('Invalid Page - Zero', `${baseUrl}/api/products?page=0`, 400, 'Page must be');
        await testEndpoint('Invalid Page - Negative', `${baseUrl}/api/products?page=-1`, 400, 'Page must be');
        await testEndpoint('Invalid Limit - Zero', `${baseUrl}/api/products?limit=0`, 400, 'Limit must be');
        await testEndpoint('Invalid Limit - Too High', `${baseUrl}/api/products?limit=101`, 400, 'cannot exceed');

        // ===========================================
        // 2. PRICE PARAMETER ERROR TESTS
        // ===========================================
        console.log('💰 PRICE PARAMETER ERROR TESTS');
        console.log('===============================');

        await testEndpoint('Invalid minPrice - Negative', `${baseUrl}/api/products?minPrice=-10`, 400, 'positive number');
        await testEndpoint('Invalid maxPrice - String', `${baseUrl}/api/products?maxPrice=abc`, 400, 'positive number');
        await testEndpoint('Invalid Price Range', `${baseUrl}/api/products?minPrice=100&maxPrice=50`, 400, 'greater than maxPrice');

        // ===========================================
        // 3. PRODUCT ID ERROR TESTS
        // ===========================================
        console.log('🆔 PRODUCT ID ERROR TESTS');
        console.log('==========================');

        await testEndpoint('Non-existent Product ID', `${baseUrl}/api/products/99999999`, 404, 'not found');
        await testEndpoint('Invalid Product ID', `${baseUrl}/api/products/invalid-id`, 404, 'not found');

        // ===========================================
        // 4. ROUTE NOT FOUND TESTS
        // ===========================================
        console.log('🔍 ROUTE NOT FOUND TESTS');
        console.log('=========================');

        await testEndpoint('Invalid API Route', `${baseUrl}/api/invalid-route`, 404, 'Route not found');
        await testEndpoint('Typo in Route', `${baseUrl}/api/product`, 404, 'Route not found');

        // ===========================================
        // 5. EDGE CASE TESTS
        // ===========================================
        console.log('⚡ EDGE CASE TESTS');
        console.log('==================');

        await testEndpoint('Very Long Search Query', `${baseUrl}/api/products?search=${'a'.repeat(1000)}`, 200);
        await testEndpoint('Unicode Characters', `${baseUrl}/api/products?search=🛍️🎉`, 200);
        await testEndpoint('XSS Attempt', `${baseUrl}/api/products?search=<script>alert('xss')</script>`, 200);

        // ===========================================
        // 6. BOUNDARY TESTS
        // ===========================================
        console.log('✅ BOUNDARY TESTS');
        console.log('==================');

        await testEndpoint('Valid Minimum Pagination', `${baseUrl}/api/products?page=1&limit=1`, 200);
        await testEndpoint('Valid Maximum Pagination', `${baseUrl}/api/products?page=1&limit=100`, 200);

        // ===========================================
        // SUMMARY REPORT
        // ===========================================
        console.log('📊 TEST SUMMARY REPORT');
        console.log('=======================');

        const totalTests = testResults.length;
        const passedTests = testResults.filter(r => r.status === 'PASSED').length;
        const failedTests = testResults.filter(r => r.status === 'FAILED').length;
        const partialTests = testResults.filter(r => r.status === 'PARTIAL').length;
        const errorTests = testResults.filter(r => r.status === 'ERROR').length;

        console.log('');
        console.log('📈 RESULTS:');
        console.log(`   Total Tests: ${totalTests}`);
        console.log(`   ✅ Passed: ${passedTests}`);
        console.log(`   ❌ Failed: ${failedTests}`);
        console.log(`   ⚠️  Partial: ${partialTests}`);
        console.log(`   💥 Errors: ${errorTests}`);

        const successRate = Math.round((passedTests / totalTests) * 100, 1);
        console.log(`   🎯 Success Rate: ${successRate}%`);

        console.log('');
        console.log('🔧 ERROR HANDLING QUALITY ASSESSMENT:');

        if (successRate >= 95) {
            console.log('   🏆 EXCELLENT - Your error handling is enterprise-grade!');
        } else if (successRate >= 85) {
            console.log('   🎉 VERY GOOD - Strong error handling with minor improvements needed');
        } else if (successRate >= 70) {
            console.log('   ⚠️  GOOD - Solid foundation but needs some refinement');
        } else {
            console.log('   ❌ NEEDS IMPROVEMENT - Several error handling issues to address');
        }

        // Save results to file
        fs.writeFileSync('error-handling-test-results.json', JSON.stringify(testResults, null, 2));
        console.log('');
        console.log('📁 Detailed results saved to: error-handling-test-results.json');

        console.log('');
        console.log('🎉 ERROR HANDLING TEST COMPLETE!');

    } catch (error) {
        console.error('❌ FATAL ERROR - Could not connect to server:', error.message);
        console.log('');
        console.log('💡 Make sure your server is running:');
        console.log('   cd backend && node server.js');
        process.exit(1);
    }
}

// Run the tests
runTests();
