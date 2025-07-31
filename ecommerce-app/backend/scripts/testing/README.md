# Testing Scripts

This folder contains scripts created for testing, learning, and demonstration purposes during the development of the e-commerce backend API.

## 📁 Files Overview

### PowerShell Scripts
- **`simple-test.ps1`** - Basic API endpoint testing script
- **`test-milestone2.ps1`** - Comprehensive Milestone 2 API testing with detailed output
- **`demo-api.ps1`** - API demonstration script for presentation purposes

### Shell Scripts  
- **`demo-api.sh`** - Cross-platform API demonstration script (Bash version)

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
```

### Running Shell Tests (Linux/Mac)
```bash
# Make executable
chmod +x demo-api.sh

# Run demo
./demo-api.sh
```

## 📊 What These Scripts Test

1. **Products API Endpoints**
   - GET /api/products (with pagination)
   - GET /api/products/{id}
   - GET /api/products/categories
   - GET /api/products/brands

2. **Error Handling**
   - 404 errors for non-existent products
   - Input validation
   - Server error responses

3. **Advanced Features**
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
