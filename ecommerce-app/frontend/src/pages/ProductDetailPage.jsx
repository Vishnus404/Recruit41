import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3000/api/products/${id}`)
      const data = await response.json()
      
      if (data.success) {
        setProduct(data.data)
      } else {
        setError('Product not found')
      }
    } catch (err) {
      setError('Error loading product: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = () => {
    if (!product) return
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(item => item.id === product._id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: product._id,
        name: product.name,
        brand: product.brand,
        price: product.retail_price,
        quantity: quantity
      })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    alert(`Added ${quantity} ${product.name} to cart!`)
  }

  const buyNow = () => {
    addToCart()
    navigate('/cart')
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading product details...</p>
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
            <h4>Product Not Found</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Back to Products
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container">
        <div className="error-card">
          <div className="error-icon">📦</div>
          <div className="error-content">
            <h4>Product Not Found</h4>
            <p>The product you're looking for doesn't exist.</p>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Back to Products
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="product-detail-page">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button 
            className="breadcrumb-link"
            onClick={() => navigate('/products')}
          >
            ← Back to Products
          </button>
        </div>

        <div className="product-detail-container">
          {/* Product Image */}
          <div className="product-detail-image">
            <div className="product-image-placeholder">
              <span className="product-placeholder-large">📦</span>
            </div>
            <div className="product-badges">
              <span className="badge badge-department">{product.department}</span>
              <span className="badge badge-category">{product.category}</span>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-detail-info">
            <h1 className="product-detail-title">{product.name}</h1>
            <p className="product-detail-brand">by {product.brand}</p>
            
            <div className="product-detail-price">
              <span className="current-price">${product.retail_price?.toFixed(2)}</span>
              {product.cost && (
                <span className="cost-price">Cost: ${product.cost?.toFixed(2)}</span>
              )}
            </div>

            {/* Product Details */}
            <div className="product-details-grid">
              <div className="detail-item">
                <strong>SKU:</strong> {product.sku || 'N/A'}
              </div>
              <div className="detail-item">
                <strong>Department:</strong> {product.department}
              </div>
              <div className="detail-item">
                <strong>Category:</strong> {product.category}
              </div>
              <div className="detail-item">
                <strong>Brand:</strong> {product.brand}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="product-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </button>
                  <input 
                    id="quantity"
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="qty-input"
                    min="1"
                  />
                  <button 
                    className="qty-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  className="btn btn-primary btn-large"
                  onClick={addToCart}
                >
                  Add to Cart
                </button>
                <button 
                  className="btn btn-secondary btn-large"
                  onClick={buyNow}
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="product-extra-info">
              <div className="info-section">
                <h3>Product Information</h3>
                <p>This product is part of our {product.department} collection in the {product.category} category. 
                   Manufactured by {product.brand}, this item offers quality and value.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
