import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import departmentService from '../services/departmentService';

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

      console.log(`Fetching department data for ID: ${departmentId}, page: ${page}`);
      
      const data = await departmentService.getDepartmentProducts(departmentId, page, 12);
      console.log('Department data received:', data);
      
      setDepartmentInfo(data.departmentInfo);
      setProducts(data.products);
      setPagination(data.pagination);
      setCurrentPage(page);
      
    } catch (err) {
      console.error('Failed to fetch department data:', err);
      setError(`Failed to load department: ${err.message}`);
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
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e2e8f0', 
            borderTop: '4px solid #4299e1', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading department products from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
          <h2 style={{ color: '#e53e3e', marginBottom: '1rem' }}>Error Loading Department</h2>
          <p style={{ color: '#718096', marginBottom: '1.5rem' }}>{error}</p>
          <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Make sure your backend server is running on http://localhost:3000
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => fetchDepartmentData(1)}
              style={{
                background: '#4299e1',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            <Link 
              to="/departments"
              style={{
                background: '#edf2f7',
                color: '#4a5568',
                border: '1px solid #e2e8f0',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Back to Departments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Breadcrumb Navigation */}
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginBottom: '2rem', 
          fontSize: '0.9rem' 
        }}>
          <Link to="/" style={{ color: '#4299e1', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: '#a0aec0' }}>›</span>
          <Link to="/departments" style={{ color: '#4299e1', textDecoration: 'none' }}>Departments</Link>
          <span style={{ color: '#a0aec0' }}>›</span>
          <span style={{ color: '#4a5568', fontWeight: '500' }}>{departmentInfo?.name}</span>
        </nav>

        {/* Department Header */}
        <header style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            color: '#2d3748', 
            marginBottom: '1rem', 
            fontWeight: '700' 
          }}>
            {departmentInfo?.name}
          </h1>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1rem', 
            alignItems: 'center' 
          }}>
            <span style={{
              background: '#4299e1',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              {pagination.totalItems?.toLocaleString() || 0} products
            </span>
            {departmentInfo?.stats && (
              <>
                <span style={{
                  color: '#718096',
                  fontSize: '0.9rem',
                  background: '#edf2f7',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '16px'
                }}>
                  Average Price: {formatPrice(departmentInfo.stats.averagePrice)}
                </span>
                <span style={{
                  color: '#718096',
                  fontSize: '0.9rem',
                  background: '#edf2f7',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '16px'
                }}>
                  Price Range: {formatPrice(departmentInfo.stats.minPrice)} - {formatPrice(departmentInfo.stats.maxPrice)}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Products Section Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.5rem', 
          flexWrap: 'wrap', 
          gap: '1rem' 
        }}>
          <h2 style={{ fontSize: '1.8rem', color: '#2d3748', margin: '0', fontWeight: '600' }}>
            Products
          </h2>
          <div style={{ color: '#718096', fontSize: '0.9rem' }}>
            Showing {((currentPage - 1) * pagination.limit) + 1}-{Math.min(currentPage * pagination.limit, pagination.totalItems)} of {pagination.totalItems} products
          </div>
        </div>

        {/* Loading Overlay */}
        {loadingProducts && (
          <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(248, 249, 250, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '4px solid #e2e8f0', 
                borderTop: '4px solid #4299e1', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              <p>Loading products...</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
          opacity: loadingProducts ? 0.5 : 1
        }}>
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
              }}
            >
              <div style={{
                height: '200px',
                background: '#edf2f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: '#4299e1',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}>
                  {product.name.charAt(0)}
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {product.name}
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    fontSize: '0.85rem',
                    color: '#718096',
                    fontWeight: '500'
                  }}>
                    {product.brand}
                  </span>
                  <span style={{
                    fontSize: '0.85rem',
                    color: '#718096'
                  }}>
                    {product.category}
                  </span>
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  color: '#4299e1',
                  fontWeight: '700'
                }}>
                  {formatPrice(product.retail_price)}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            marginTop: '3rem',
            padding: '2rem 0'
          }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loadingProducts}
              style={{
                background: currentPage <= 1 || loadingProducts ? '#cbd5e0' : '#4299e1',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: currentPage <= 1 || loadingProducts ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
            >
              ← Previous
            </button>
            
            <div style={{ color: '#4a5568', fontWeight: '500' }}>
              Page {currentPage} of {pagination.totalPages}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= pagination.totalPages || loadingProducts}
              style={{
                background: currentPage >= pagination.totalPages || loadingProducts ? '#cbd5e0' : '#4299e1',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: currentPage >= pagination.totalPages || loadingProducts ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* No Products Message */}
        {products.length === 0 && !loadingProducts && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            marginTop: '2rem'
          }}>
            <h2 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>No Products Found</h2>
            <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
              This department doesn't have any products available at the moment.
            </p>
            <Link 
              to="/departments"
              style={{
                background: '#edf2f7',
                color: '#4a5568',
                border: '1px solid #e2e8f0',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Browse Other Departments
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DepartmentPage;
