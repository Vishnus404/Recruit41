import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CategoriesPage from './pages/CategoriesPage'
import CartPage from './pages/CartPage'
import DepartmentListPage from './pages/DepartmentListPageAPI'
import DepartmentPage from './pages/DepartmentPageAPI'
import './App.css'

function Header() {
  const location = useLocation()
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🛍️</span>
            E-Commerce Store
          </Link>
          <nav className="nav">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
              Products
            </Link>
            <Link to="/departments" className={`nav-link ${isActive('/departments') ? 'active' : ''}`}>
              Departments
            </Link>
            <Link to="/categories" className={`nav-link ${isActive('/categories') ? 'active' : ''}`}>
              Categories
            </Link>
            <Link to="/cart" className={`nav-link ${isActive('/cart') ? 'active' : ''}`}>
              Cart
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About Us</h4>
            <p>Your trusted e-commerce partner with thousands of quality products.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/products" className="footer-link">All Products</Link>
            <Link to="/departments" className="footer-link">Departments</Link>
            <Link to="/categories" className="footer-link">Categories</Link>
            <Link to="/cart" className="footer-link">Shopping Cart</Link>
          </div>
          <div className="footer-section">
            <h4>Customer Service</h4>
            <a href="#" className="footer-link">Contact Us</a>
            <a href="#" className="footer-link">FAQ</a>
            <a href="#" className="footer-link">Returns</a>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <a href="#" className="footer-link">Facebook</a>
            <a href="#" className="footer-link">Twitter</a>
            <a href="#" className="footer-link">Instagram</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 E-Commerce Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/departments" element={<DepartmentListPage />} />
            <Route path="/departments/:id" element={<DepartmentPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App
