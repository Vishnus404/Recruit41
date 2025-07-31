# 🚨 Comprehensive Error Handling Test Script
# Tests all error scenarios and edge cases for the E-commerce API

Write-Host "🚨 COMPREHENSIVE ERROR HANDLING TESTS" -ForegroundColor Red
Write-Host "=======================================" -ForegroundColor Red
Write-Host ""

$baseUrl = "http://localhost:3000"
$testResults = @()

function Test-Endpoint {
    param(
        [string]$TestName,
        [string]$Url,
        [int]$ExpectedStatus,
        [string]$ExpectedError = $null
    )
    
    Write-Host "🧪 Testing: $TestName" -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri $Url -ErrorAction Stop
        $actualStatus = 200
        Write-Host "   ❌ UNEXPECTED SUCCESS - Expected error but got 200" -ForegroundColor Red
        Write-Host "   Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
        $testResults += @{ Test = $TestName; Status = "FAILED"; Reason = "Expected error but got success" }
    }
    catch {
        $actualStatus = $_.Exception.Response.StatusCode.value__
        
        if ($actualStatus -eq $ExpectedStatus) {
            Write-Host "   ✅ SUCCESS - Got expected status $actualStatus" -ForegroundColor Green
            
            if ($ExpectedError) {
                $errorResponse = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($errorResponse)
                $errorBody = $reader.ReadToEnd() | ConvertFrom-Json
                
                if ($errorBody.error -like "*$ExpectedError*" -or $errorBody.message -like "*$ExpectedError*") {
                    Write-Host "   ✅ SUCCESS - Error message contains expected text" -ForegroundColor Green
                    $testResults += @{ Test = $TestName; Status = "PASSED"; StatusCode = $actualStatus }
                } else {
                    Write-Host "   ⚠️  WARNING - Status correct but error message unexpected" -ForegroundColor Orange
                    Write-Host "   Expected: $ExpectedError" -ForegroundColor Gray
                    Write-Host "   Got: $($errorBody.error) / $($errorBody.message)" -ForegroundColor Gray
                    $testResults += @{ Test = $TestName; Status = "PARTIAL"; StatusCode = $actualStatus }
                }
            } else {
                $testResults += @{ Test = $TestName; Status = "PASSED"; StatusCode = $actualStatus }
            }
        } else {
            Write-Host "   ❌ FAILED - Expected $ExpectedStatus but got $actualStatus" -ForegroundColor Red
            $testResults += @{ Test = $TestName; Status = "FAILED"; Expected = $ExpectedStatus; Actual = $actualStatus }
        }
    }
    
    Write-Host ""
}

# ===========================================
# 1. PAGINATION ERROR TESTS
# ===========================================
Write-Host "📄 PAGINATION ERROR TESTS" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

Test-Endpoint "Invalid Page - Zero" "$baseUrl/api/products?page=0" 400 "Page must be"
Test-Endpoint "Invalid Page - Negative" "$baseUrl/api/products?page=-1" 400 "Page must be"
Test-Endpoint "Invalid Page - String" "$baseUrl/api/products?page=abc" 400
Test-Endpoint "Invalid Limit - Zero" "$baseUrl/api/products?limit=0" 400 "Limit must be"
Test-Endpoint "Invalid Limit - Negative" "$baseUrl/api/products?limit=-5" 400 "Limit must be"
Test-Endpoint "Invalid Limit - Too High" "$baseUrl/api/products?limit=101" 400 "cannot exceed"
Test-Endpoint "Invalid Limit - String" "$baseUrl/api/products?limit=xyz" 400

# ===========================================
# 2. PRICE PARAMETER ERROR TESTS
# ===========================================
Write-Host "💰 PRICE PARAMETER ERROR TESTS" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

Test-Endpoint "Invalid minPrice - Negative" "$baseUrl/api/products?minPrice=-10" 400 "positive number"
Test-Endpoint "Invalid minPrice - String" "$baseUrl/api/products?minPrice=abc" 400 "positive number"
Test-Endpoint "Invalid maxPrice - Negative" "$baseUrl/api/products?maxPrice=-5" 400 "positive number"
Test-Endpoint "Invalid maxPrice - String" "$baseUrl/api/products?maxPrice=xyz" 400 "positive number"
Test-Endpoint "Invalid Price Range" "$baseUrl/api/products?minPrice=100&maxPrice=50" 400 "greater than maxPrice"

# ===========================================
# 3. PRODUCT ID ERROR TESTS
# ===========================================
Write-Host "🆔 PRODUCT ID ERROR TESTS" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan

Test-Endpoint "Empty Product ID" "$baseUrl/api/products/" 404
Test-Endpoint "Non-existent Product ID" "$baseUrl/api/products/99999999" 404 "not found"
Test-Endpoint "Invalid Product ID Format" "$baseUrl/api/products/invalid-id-format" 404 "not found"
Test-Endpoint "Special Characters in ID" "$baseUrl/api/products/@#$%^&*()" 404 "not found"

# ===========================================
# 4. ROUTE NOT FOUND TESTS
# ===========================================
Write-Host "🔍 ROUTE NOT FOUND TESTS" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

Test-Endpoint "Invalid API Route" "$baseUrl/api/invalid-route" 404 "Route not found"
Test-Endpoint "Invalid Products Subroute" "$baseUrl/api/products/categories/invalid" 404 "Route not found"
Test-Endpoint "Typo in Route" "$baseUrl/api/product" 404 "Route not found"
Test-Endpoint "Wrong HTTP Method" "$baseUrl/api/products" 404 # This would need a POST test

# ===========================================
# 5. EDGE CASE TESTS
# ===========================================
Write-Host "⚡ EDGE CASE TESTS" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan

Test-Endpoint "Very Long Search Query" "$baseUrl/api/products?search=$('a' * 1000)" 200  # Should work
Test-Endpoint "Unicode Characters" "$baseUrl/api/products?search=🛍️🎉" 200  # Should work
Test-Endpoint "SQL Injection Attempt" "$baseUrl/api/products?category='; DROP TABLE products; --" 200  # Should be safe
Test-Endpoint "XSS Attempt" "$baseUrl/api/products?search=<script>alert('xss')</script>" 200  # Should be safe

# ===========================================
# 6. POSITIVE BOUNDARY TESTS
# ===========================================
Write-Host "✅ POSITIVE BOUNDARY TESTS" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

Write-Host "🧪 Testing: Valid Boundary - Page 1, Limit 1" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/products?page=1&limit=1"
    Write-Host "   ✅ SUCCESS - Minimum valid pagination works" -ForegroundColor Green
    $testResults += @{ Test = "Valid Boundary - Minimum"; Status = "PASSED"; StatusCode = 200 }
} catch {
    Write-Host "   ❌ FAILED - Minimum valid pagination failed" -ForegroundColor Red
    $testResults += @{ Test = "Valid Boundary - Minimum"; Status = "FAILED" }
}

Write-Host "🧪 Testing: Valid Boundary - Page 1, Limit 100" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/products?page=1&limit=100"
    Write-Host "   ✅ SUCCESS - Maximum valid pagination works" -ForegroundColor Green
    $testResults += @{ Test = "Valid Boundary - Maximum"; Status = "PASSED"; StatusCode = 200 }
} catch {
    Write-Host "   ❌ FAILED - Maximum valid pagination failed" -ForegroundColor Red
    $testResults += @{ Test = "Valid Boundary - Maximum"; Status = "FAILED" }
}

Write-Host ""

# ===========================================
# 7. CONCURRENT REQUEST SIMULATION
# ===========================================
Write-Host "🔄 CONCURRENT REQUEST SIMULATION" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

Write-Host "🧪 Testing: Multiple concurrent invalid requests" -ForegroundColor Yellow
$jobs = @()
for ($i = 1; $i -le 5; $i++) {
    $jobs += Start-Job -ScriptBlock {
        param($url)
        try {
            Invoke-RestMethod -Uri $url -ErrorAction Stop
            return @{ Success = $true }
        } catch {
            return @{ Success = $false; Status = $_.Exception.Response.StatusCode.value__ }
        }
    } -ArgumentList "$baseUrl/api/products?page=0"
}

$results = $jobs | Wait-Job | Receive-Job
$jobs | Remove-Job

$failedCount = ($results | Where-Object { -not $_.Success }).Count
if ($failedCount -eq 5) {
    Write-Host "   ✅ SUCCESS - All concurrent invalid requests properly rejected" -ForegroundColor Green
    $testResults += @{ Test = "Concurrent Invalid Requests"; Status = "PASSED" }
} else {
    Write-Host "   ❌ FAILED - Some concurrent requests had unexpected results" -ForegroundColor Red
    $testResults += @{ Test = "Concurrent Invalid Requests"; Status = "FAILED" }
}

Write-Host ""

# ===========================================
# SUMMARY REPORT
# ===========================================
Write-Host "📊 TEST SUMMARY REPORT" -ForegroundColor Green
Write-Host "=======================" -ForegroundColor Green

$totalTests = $testResults.Count
$passedTests = ($testResults | Where-Object { $_.Status -eq "PASSED" }).Count
$failedTests = ($testResults | Where-Object { $_.Status -eq "FAILED" }).Count
$partialTests = ($testResults | Where-Object { $_.Status -eq "PARTIAL" }).Count

Write-Host ""
Write-Host "📈 RESULTS:" -ForegroundColor White
Write-Host "   Total Tests: $totalTests" -ForegroundColor White
Write-Host "   ✅ Passed: $passedTests" -ForegroundColor Green
Write-Host "   ❌ Failed: $failedTests" -ForegroundColor Red
Write-Host "   ⚠️  Partial: $partialTests" -ForegroundColor Yellow

$successRate = [math]::Round(($passedTests / $totalTests) * 100, 1)
Write-Host "   🎯 Success Rate: $successRate%" -ForegroundColor $(if ($successRate -ge 90) { "Green" } elseif ($successRate -ge 70) { "Yellow" } else { "Red" })

Write-Host ""
Write-Host "🔧 ERROR HANDLING QUALITY ASSESSMENT:" -ForegroundColor White

if ($successRate -ge 95) {
    Write-Host "   🏆 EXCELLENT - Your error handling is enterprise-grade!" -ForegroundColor Green
} elseif ($successRate -ge 85) {
    Write-Host "   🎉 VERY GOOD - Strong error handling with minor improvements needed" -ForegroundColor Green
} elseif ($successRate -ge 70) {
    Write-Host "   ⚠️  GOOD - Solid foundation but needs some refinement" -ForegroundColor Yellow
} else {
    Write-Host "   ❌ NEEDS IMPROVEMENT - Several error handling issues to address" -ForegroundColor Red
}

Write-Host ""
Write-Host "💡 RECOMMENDATIONS:" -ForegroundColor Cyan
Write-Host "   • Ensure server is running before testing" -ForegroundColor White
Write-Host "   • Review failed tests for API improvements" -ForegroundColor White
Write-Host "   • Consider adding rate limiting for production" -ForegroundColor White
Write-Host "   • Implement request validation middleware" -ForegroundColor White

Write-Host ""
Write-Host "🎉 ERROR HANDLING TEST COMPLETE!" -ForegroundColor Green

# Optional: Save detailed results to file
$testResults | ConvertTo-Json -Depth 2 | Out-File "error-handling-test-results.json"
Write-Host "📁 Detailed results saved to: error-handling-test-results.json" -ForegroundColor Gray
