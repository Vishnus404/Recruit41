import { useState, useEffect } from 'react'

function CartPage() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading cart from localStorage or API
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(savedCart)
    setLoading(false)
  }, [])

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
      return
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="cart-page">
          <h2 className="section-title">Shopping Cart</h2>
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <a href="/products" className="btn btn-primary">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="cart-page">
        <h2 className="section-title">Shopping Cart</h2>
        
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <span className="product-placeholder">📦</span>
                </div>
                
                <div className="item-details">
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-brand">{item.brand}</p>
                  <p className="item-price">${item.price?.toFixed(2)}</p>
                </div>
                
                <div className="item-quantity">
                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  title="Remove from cart"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <button className="btn btn-primary checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
