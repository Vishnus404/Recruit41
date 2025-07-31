import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import departmentService from '../services/departmentService';
import '../styles/DepartmentPage.css';

const DepartmentPage = () => {
  const { id: departmentId } = useParams();
  const [departmentInfo, setDepartmentInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (departmentId) {
      fetchDepartmentData(1);
    }
  }, [departmentId]);

  const fetchDepartmentData = async (page = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingProducts(true);
      }
      setError(null);

      const data = await departmentService.getDepartmentProducts(departmentId, page, 12);
      
      setDepartmentInfo(data.departmentInfo);
      setProducts(data.products);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch department data:', err);
    } finally {
      setLoading(false);
      setLoadingProducts(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && !loadingProducts) {
      fetchDepartmentData(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="department-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading department...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="department-page">
        <div className="error-container">
          <h2>Error Loading Department</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => fetchDepartmentData(1)} className="retry-button">
              Try Again
            </button>
            <Link to="/departments" className="back-button">
              Back to Departments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="department-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">›</span>
          <Link to="/departments">Departments</Link>
          <span className="separator">›</span>
          <span className="current">{departmentInfo?.name}</span>
        </nav>

        {/* Department Header */}
        <header className="department-header">
          <h1>{departmentInfo?.name}</h1>
          <div className="department-stats">
            <span className="total-products">
              {pagination.totalItems?.toLocaleString()} products
            </span>
            {departmentInfo?.stats && (
              <div className="additional-stats">
                <span>Average Price: {formatPrice(departmentInfo.stats.averagePrice)}</span>
                <span>Price Range: {formatPrice(departmentInfo.stats.minPrice)} - {formatPrice(departmentInfo.stats.maxPrice)}</span>
              </div>
            )}
          </div>
        </header>

        {/* Products Grid */}
        <div className="products-section">
          <div className="products-header">
            <h2>Products</h2>
            <div className="products-info">
              Showing {((currentPage - 1) * pagination.limit) + 1}-{Math.min(currentPage * pagination.limit, pagination.totalItems)} of {pagination.totalItems} products
            </div>
          </div>

          {loadingProducts && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}

          <div className={`products-grid ${loadingProducts ? 'loading' : ''}`}>
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="product-card"
              >
                <div className="product-image">
                  <div className="image-placeholder">
                    {product.name.charAt(0)}
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-details">
                    <span className="product-brand">{product.brand}</span>
                    <span className="product-category">{product.category}</span>
                  </div>
                  <div className="product-price">
                    {formatPrice(product.retail_price)}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || loadingProducts}
                className="pagination-button"
              >
                ← Previous
              </button>
              
              <div className="pagination-info">
                <span>
                  Page {currentPage} of {pagination.totalPages}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.totalPages || loadingProducts}
                className="pagination-button"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {products.length === 0 && !loadingProducts && (
          <div className="no-products">
            <h2>No Products Found</h2>
            <p>This department doesn't have any products available at the moment.</p>
            <Link to="/departments" className="back-button">
              Browse Other Departments
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentPage;
