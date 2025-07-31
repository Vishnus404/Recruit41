#!/bin/bash
# Demo Script for E-commerce API
# Run this script to demonstrate the API functionality

echo "🎯 E-COMMERCE DATABASE DEMO"
echo "=============================="
echo ""

# Check if server is running
echo "1️⃣ CHECKING SERVER STATUS..."
echo "------------------------------"
curl -s http://localhost:3000/health | jq '.' 2>/dev/null || echo "❌ Server not running. Please start with: npm start"
echo ""

# Show API information
echo "2️⃣ API INFORMATION..."
echo "---------------------"
curl -s http://localhost:3000/ | jq '.' 2>/dev/null || echo "API endpoint not available"
echo ""

# Sample products
echo "3️⃣ SAMPLE PRODUCTS..."
echo "---------------------"
curl -s http://localhost:3000/api/products | jq '.[0:3]' 2>/dev/null || echo "Products endpoint not available"
echo ""

# Sample users
echo "4️⃣ SAMPLE USERS..."
echo "------------------"
curl -s http://localhost:3000/api/users | jq '.[0:3] | .[] | {name: (.first_name + " " + .last_name), email: .email, city: .city, traffic_source: .traffic_source}' 2>/dev/null || echo "Users endpoint not available"
echo ""

# Sample orders
echo "5️⃣ SAMPLE ORDERS..."
echo "-------------------"
curl -s http://localhost:3000/api/orders | jq '.[0:3]' 2>/dev/null || echo "Orders endpoint not available"
echo ""

echo "✅ Demo completed!"
echo ""
echo "💡 To run individual queries:"
echo "   curl http://localhost:3000/health"
echo "   curl http://localhost:3000/api/products"
echo "   curl http://localhost:3000/api/users"
echo "   curl http://localhost:3000/api/orders"
