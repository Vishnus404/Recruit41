import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products?limit=8&sort=retail_price')
      const data = await response.json()
      
      if (data.success) {
        setFeaturedProducts(data.data)
      }
    } catch (err) {
      console.error('Error fetching featured products:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to E-Commerce Store</h1>
            <p className="hero-subtitle">
              Discover amazing products from top brands. Browse our extensive catalog
              of over 29,000 products across multiple categories with the best deals and latest trends.
            </p>
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-number">29K+</div>
                <div className="stat-label">Products</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">100K+</div>
                <div className="stat-label">Customers</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">26</div>
                <div className="stat-label">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading featured products...</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <Link key={product._id} to={`/products/${product._id}`} className="product-card">
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
              ))}
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href="/products" className="btn btn-primary btn-large">
              View All Products
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
