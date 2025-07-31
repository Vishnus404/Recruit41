import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchBrands()
  }, [searchTerm, selectedCategory, selectedBrand, sortBy, currentPage])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        sort: sortBy
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedBrand) params.append('brand', selectedBrand)

      const response = await fetch(`http://localhost:3000/api/products?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data)
        setTotalPages(data.totalPages || 1)
      } else {
        setError('Failed to fetch products')
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data.slice(0, 20)) // Limit to top 20
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products/brands')
      const data = await response.json()
      if (data.success) {
        setBrands(data.data.slice(0, 20)) // Limit to top 20
      }
    } catch (err) {
      console.error('Error fetching brands:', err)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedBrand('')
    setSortBy('name')
    setCurrentPage(1)
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

  if (error) {
    return (
      <div className="container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h4>Error Loading Products</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchProducts}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="products-page">
        <h2 className="section-title">All Products</h2>
        
        {/* Filters */}
        <div className="filters-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          
          <div className="filter-controls">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat._id}>{cat._id}</option>
              ))}
            </select>
            
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="filter-select"
            >
              <option value="">All Brands</option>
              {brands.map((brand, index) => (
                <option key={index} value={brand._id}>{brand._id}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Sort by Name</option>
              <option value="retail_price">Sort by Price</option>
              <option value="brand">Sort by Brand</option>
            </select>
            
            <button onClick={resetFilters} className="btn btn-secondary">
              Reset Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <>
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="btn btn-secondary"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="btn btn-secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
