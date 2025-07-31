import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/products/categories')
      const data = await response.json()
      
      console.log('Categories API response:', data) // Debug log
      
      if (data.success) {
        setCategories(data.data)
      } else {
        setError('Failed to fetch categories')
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchProductsByCategory = async (category) => {
    try {
      setLoading(true)
      console.log('Fetching products for category:', category) // Debug log
      const response = await fetch(`http://localhost:3000/api/products?category=${encodeURIComponent(category)}&limit=20`)
      const data = await response.json()
      
      console.log('Products API response:', data) // Debug log
      
      if (data.success) {
        setProducts(data.data)
        setSelectedCategory(category)
        console.log('Products loaded:', data.data.length) // Debug log
      } else {
        setError('Failed to fetch products for this category')
      }
    } catch (err) {
      setError('Error fetching products: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Electronics': '📱',
      'Clothing': '👕',
      'Home & Garden': '🏠',
      'Sports': '⚽',
      'Beauty': '💄',
      'Books': '📚',
      'Toys': '🧸',
      'Food': '🍔',
      'Health': '💊',
      'Automotive': '🚗',
      'default': '📦'
    }
    return icons[category] || icons.default
  }

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(item => item.id === product._id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: product._id,
        name: product.name,
        brand: product.brand,
        price: product.retail_price,
        quantity: 1
      })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Product added to cart!')
  }

  if (loading && !selectedCategory) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h4>Error Loading Categories</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchCategories}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="categories-page">
        <h2 className="section-title">
          {selectedCategory ? `${selectedCategory} Products` : 'Shop by Category'}
        </h2>

        {/* Debug button - remove in production */}
        {!selectedCategory && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button 
              className="btn btn-secondary"
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:3000/api/debug/sample-products');
                  const data = await response.json();
                  console.log('Debug data:', data);
                  alert('Check console for debug data');
                } catch (err) {
                  console.error('Debug failed:', err);
                }
              }}
            >
              🔍 Debug Database
            </button>
          </div>
        )}

        {selectedCategory && (
          <div className="breadcrumb">
            <button 
              className="breadcrumb-link"
              onClick={() => {
                setSelectedCategory(null)
                setProducts([])
              }}
            >
              ← Back to Categories
            </button>
          </div>
        )}

        {!selectedCategory ? (
          <div className="categories-grid">
            {categories.map((category, index) => {
              console.log('Rendering category:', category); // Debug log
              const categoryName = category._id || category.category || 'Unknown Category';
              const categoryCount = category.count || 0;
              
              return (
                <div 
                  key={index}
                  className="category-card"
                  onClick={() => fetchProductsByCategory(categoryName)}
                >
                  <div className="category-icon">
                    {getCategoryIcon(categoryName)}
                  </div>
                  <h3 className="category-name">
                    {categoryName}
                  </h3>
                  <p className="category-count">
                    {categoryCount} products
                  </p>
                  {category.avgPrice && (
                    <p className="category-price">
                      Avg: ${category.avgPrice.toFixed(2)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <div className="category-results-header">
              <p className="results-count">
                {loading ? 'Loading...' : `${products.length} products found in ${selectedCategory}`}
              </p>
            </div>
            
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <div key={product._id} className="product-card">
                    <Link to={`/products/${product._id}`} className="product-link">
                      <div className="product-image">
                        <span className="product-placeholder">📦</span>
                        <div className="product-badge">{product.department}</div>
                      </div>
                      <div className="product-info">
                        <h4 className="product-name">{product.name}</h4>
                        <p className="product-brand">{product.brand}</p>
                        <div className="product-price">
                          <span className="price">${product.retail_price?.toFixed(2)}</span>
                          <span className="department">{product.category}</span>
                        </div>
                      </div>
                    </Link>
                    <div className="product-actions">
                      <button 
                        className="btn btn-primary add-to-cart-btn"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {products.length === 0 && !loading && (
              <div className="empty-category">
                <div className="empty-icon">📭</div>
                <h3>No products found</h3>
                <p>There are no products in this category yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoriesPage
