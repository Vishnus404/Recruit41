# PowerShell Demo Script for E-commerce API
# Run this script to demonstrate the API functionality

Write-Host "🎯 E-COMMERCE DATABASE DEMO" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if server is running
Write-Host "1️⃣ CHECKING SERVER STATUS..." -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Gray
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get
    $health | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Server not running. Please start with: npm start" -ForegroundColor Red
}
Write-Host ""

# Show API information
Write-Host "2️⃣ API INFORMATION..." -ForegroundColor Yellow
Write-Host "---------------------" -ForegroundColor Gray
try {
    $info = Invoke-RestMethod -Uri "http://localhost:3000/" -Method Get
    $info | ConvertTo-Json -Depth 3
} catch {
    Write-Host "API endpoint not available" -ForegroundColor Red
}
Write-Host ""

# Sample products
Write-Host "3️⃣ SAMPLE PRODUCTS..." -ForegroundColor Yellow
Write-Host "---------------------" -ForegroundColor Gray
try {
    $products = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Get
    $products[0..2] | ForEach-Object {
        Write-Host "📦 Product: $($_.name)" -ForegroundColor Green
        Write-Host "   Category: $($_.category) | Brand: $($_.brand)" -ForegroundColor White
        Write-Host "   Price: $($_.retail_price) | Cost: $($_.cost)" -ForegroundColor White
        Write-Host ""
    }
} catch {
    Write-Host "Products endpoint not available" -ForegroundColor Red
}

# Sample users
Write-Host "4️⃣ SAMPLE USERS..." -ForegroundColor Yellow
Write-Host "------------------" -ForegroundColor Gray
try {
    $users = Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Get
    $users[0..2] | ForEach-Object {
        Write-Host "👤 User: $($_.first_name) $($_.last_name)" -ForegroundColor Green
        Write-Host "   Email: $($_.email)" -ForegroundColor White
        Write-Host "   Location: $($_.city), $($_.country)" -ForegroundColor White
        Write-Host "   Traffic Source: $($_.traffic_source)" -ForegroundColor White
        Write-Host ""
    }
} catch {
    Write-Host "Users endpoint not available" -ForegroundColor Red
}

# Sample orders
Write-Host "5️⃣ SAMPLE ORDERS..." -ForegroundColor Yellow
Write-Host "-------------------" -ForegroundColor Gray
try {
    $orders = Invoke-RestMethod -Uri "http://localhost:3000/api/orders" -Method Get
    $orders[0..2] | ForEach-Object {
        Write-Host "🛒 Order ID: $($_.order_id)" -ForegroundColor Green
        Write-Host "   User ID: $($_.user_id)" -ForegroundColor White
        Write-Host "   Status: $($_.status) | Items: $($_.num_of_item)" -ForegroundColor White
        Write-Host "   Created: $($_.created_at)" -ForegroundColor White
        Write-Host ""
    }
} catch {
    Write-Host "Orders endpoint not available" -ForegroundColor Red
}

Write-Host "✅ Demo completed!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 To run individual queries:" -ForegroundColor Cyan
Write-Host "   Invoke-RestMethod -Uri 'http://localhost:3000/health'" -ForegroundColor White
Write-Host "   Invoke-RestMethod -Uri 'http://localhost:3000/api/products'" -ForegroundColor White
Write-Host "   Invoke-RestMethod -Uri 'http://localhost:3000/api/users'" -ForegroundColor White
Write-Host "   Invoke-RestMethod -Uri 'http://localhost:3000/api/orders'" -ForegroundColor White
