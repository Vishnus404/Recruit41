# Testing Scripts

This folder contains scripts created for testing, learning, and demonstration purposes during the development of the e-commerce backend API.

## 📁 Files Overview

### PowerShell Scripts
- **`simple-test.ps1`** - Basic API endpoint testing script
- **`test-milestone2.ps1`** - Comprehensive Milestone 2 API testing with detailed output
- **`demo-api.ps1`** - API demonstration script for presentation purposes
- **`test-error-handling.ps1`** - 🚨 **NEW!** Comprehensive error handling validation

### Shell Scripts  
- **`demo-api.sh`** - Cross-platform API demonstration script (Bash version)

### Node.js Scripts
- **`run-demo-queries.js`** - Database analytics and demo queries
- **`quick-demo.js`** - Quick database connectivity test
- **`test-error-handling.js`** - 🚨 **NEW!** Cross-platform error handling tests

## 🚀 Usage

### Prerequisites
Make sure your server is running:
```bash
node server.js
```

### Running PowerShell Tests
```powershell
# Basic test
.\simple-test.ps1

# Comprehensive Milestone 2 test
.\test-milestone2.ps1

# Demo script
.\demo-api.ps1

# 🚨 NEW! Error handling validation
.\test-error-handling.ps1
```

### Running Shell Tests (Linux/Mac)
```bash
# Make executable
chmod +x demo-api.sh

# Run demo
./demo-api.sh
```

### Running Node.js Tests
```bash
# Database demo queries
node run-demo-queries.js

# Quick connectivity test
node quick-demo.js

# 🚨 NEW! Cross-platform error handling tests
node test-error-handling.js
```

## 📊 What These Scripts Test

### 1. **API Functionality Tests**
   - GET /api/products (with pagination)
   - GET /api/products/{id}
   - GET /api/products/categories
   - GET /api/products/brands

### 2. **🚨 Error Handling Tests** (NEW!)
   - **Input Validation**: Invalid pagination, price parameters
   - **HTTP Status Codes**: 400, 404, 409, 500 responses
   - **Edge Cases**: Unicode, XSS attempts, SQL injection
   - **Boundary Testing**: Min/max valid values
   - **Concurrent Requests**: Multiple simultaneous invalid requests

### 3. **Advanced Features**
   - Filtering by category, brand, price range
   - Search functionality
   - Pagination metadata
   - Profit calculations

## 🎯 Purpose

These scripts were created to:
- Validate API functionality during development
- Demonstrate completed features for Milestone 2
- Provide examples for API usage
- Support learning and understanding of REST API concepts

## 📝 Notes

- All scripts expect the server to be running on `http://localhost:3000`
- PowerShell scripts are optimized for Windows development environment
- Shell scripts provide cross-platform compatibility
- Scripts include colored output for better readability during testing
