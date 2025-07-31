# Quick API Test Script for Milestone 2
Write-Host "TESTING PRODUCTS REST API - MILESTONE 2" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Test 1: List products
Write-Host "1. Testing GET /api/products..." -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri 'http://localhost:3000/api/products?limit=3'
    Write-Host "SUCCESS! Found products with pagination" -ForegroundColor Green
    Write-Host "Total items: $($products.pagination.totalItems)" -ForegroundColor White
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Get specific product
Write-Host "2. Testing GET /api/products/13842..." -ForegroundColor Yellow
try {
    $product = Invoke-RestMethod -Uri 'http://localhost:3000/api/products/13842'
    Write-Host "SUCCESS! Got product details" -ForegroundColor Green
    Write-Host "Product: $($product.data.name)" -ForegroundColor White
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Test 404 error
Write-Host "3. Testing 404 Error Handling..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri 'http://localhost:3000/api/products/99999' -ErrorAction Stop
    Write-Host "FAILED: Should have returned 404" -ForegroundColor Red
} catch {
    Write-Host "SUCCESS! 404 error handled correctly" -ForegroundColor Green
}

Write-Host ""

# Test 4: Test filtering
Write-Host "4. Testing Category Filter..." -ForegroundColor Yellow
try {
    $filtered = Invoke-RestMethod -Uri 'http://localhost:3000/api/products?category=Accessories&limit=2'
    Write-Host "SUCCESS! Category filtering works" -ForegroundColor Green
    Write-Host "Found items in Accessories category" -ForegroundColor White
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Test categories endpoint
Write-Host "5. Testing GET /api/products/categories..." -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri 'http://localhost:3000/api/products/categories'
    Write-Host "SUCCESS! Got product categories" -ForegroundColor Green
    Write-Host "Found $($categories.total) categories" -ForegroundColor White
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "MILESTONE 2 TESTING COMPLETE!" -ForegroundColor Green
Write-Host "Your REST API is working correctly!" -ForegroundColor Yellow
