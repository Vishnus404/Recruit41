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

      console.log(`Fetching real department data for ID: ${departmentId}, page: ${page}`);
      
      // Fetch real data from API
      const data = await departmentService.getDepartmentProducts(departmentId, page, 12);
      console.log('Real department data received:', data);
      
      setDepartmentInfo(data.departmentInfo);
      setProducts(data.products);
      setPagination(data.pagination);
      setCurrentPage(page);
      
    } catch (err) {
      console.error('API failed, using fallback data:', err);
      setError(`API Error: ${err.message}. Please ensure the backend server is running on http://localhost:3000`);
      
      // Fallback to mock data
      const mockDepartments = {
        '507f1f77bcf86cd799439011': { name: 'Men', stats: { averagePrice: 45.50, minPrice: 15.99, maxPrice: 299.99 } },
        '507f1f77bcf86cd799439012': { name: 'Women', stats: { averagePrice: 52.75, minPrice: 19.99, maxPrice: 349.99 } }
      };
      
      const mockProductsByDepartment = {
        '507f1f77bcf86cd799439011': [
          { _id: '1', name: 'Men\'s Classic Cotton T-Shirt', brand: 'ComfortWear', category: 'Men\'s Apparel', retail_price: 24.99 },
          { _id: '2', name: 'Men\'s Denim Blue Jeans', brand: 'StyleCraft', category: 'Men\'s Bottoms', retail_price: 79.99 },
          { _id: '3', name: 'Men\'s Casual Sneakers', brand: 'StepForward', category: 'Men\'s Footwear', retail_price: 89.99 }
        ],
        '507f1f77bcf86cd799439012': [
          { _id: '7', name: 'Women\'s Summer Dress', brand: 'ElegantStyle', category: 'Women\'s Dresses', retail_price: 75.50 },
          { _id: '8', name: 'Women\'s High-Waist Jeans', brand: 'TrendyFit', category: 'Women\'s Bottoms', retail_price: 89.99 },
          { _id: '9', name: 'Women\'s Ballet Flats', brand: 'ComfortStep', category: 'Women\'s Footwear', retail_price: 69.99 }
        ]
      };
      
      const dept = mockDepartments[departmentId];
      const deptProducts = mockProductsByDepartment[departmentId];
      
      if (dept && deptProducts) {
        setDepartmentInfo(dept);
        setProducts(deptProducts);
        setPagination({ totalItems: deptProducts.length, totalPages: 1, currentPage: 1, limit: 12 });
      }
      
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

  const basicStyles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem'
    },
    breadcrumb: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '2rem',
      fontSize: '0.9rem'
    },
    breadcrumbLink: {
      color: '#4299e1',
      textDecoration: 'none'
    },
    separator: {
      color: '#a0aec0'
    },
    current: {
      color: '#4a5568',
      fontWeight: '500'
    },
    errorBanner: {
      background: '#fed7d7',
      color: '#c53030',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '2rem',
      border: '1px solid #feb2b2'
    },
    header: {
      background: 'white',
      padding: '2rem',
      borderRadius: '12px',
      marginBottom: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0'
    },
    title: {
      fontSize: '2.5rem',
      color: '#2d3748',
      marginBottom: '1rem',
      fontWeight: '700'
    },
    stats: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      alignItems: 'center'
    },
    totalProducts: {
      background: '#4299e1',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontWeight: '600',
      fontSize: '0.9rem'
    },
    statItem: {
      color: '#718096',
      fontSize: '0.9rem',
      background: '#edf2f7',
      padding: '0.4rem 0.8rem',
      borderRadius: '16px'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    productCard: {
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      textDecoration: 'none',
      color: 'inherit',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease'
    },
    productImage: {
      height: '200px',
      background: '#edf2f7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    imagePlaceholder: {
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
    },
    productInfo: {
      padding: '1.5rem'
    },
    productName: {
      fontSize: '1.1rem',
      color: '#2d3748',
      marginBottom: '0.5rem',
      fontWeight: '600',
      lineHeight: '1.3'
    },
    productDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      marginBottom: '1rem'
    },
    productBrand: {
      fontSize: '0.85rem',
      color: '#718096',
      fontWeight: '500'
    },
    productCategory: {
      fontSize: '0.85rem',
      color: '#718096'
    },
    productPrice: {
      fontSize: '1.2rem',
      color: '#4299e1',
      fontWeight: '700'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '2rem',
      marginTop: '3rem',
      padding: '2rem 0'
    },
    paginationButton: {
      background: '#4299e1',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '500'
    },
    paginationButtonDisabled: {
      background: '#cbd5e0',
      cursor: 'not-allowed'
    },
    paginationInfo: {
      color: '#4a5568',
      fontWeight: '500'
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      textAlign: 'center'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #4299e1',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem'
    },
    loadingOverlay: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      background: 'rgba(248, 249, 250, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '10',
      borderRadius: '12px'
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div style={basicStyles.container}>
          <div style={basicStyles.loading}>
            <div style={basicStyles.spinner}></div>
            <p>Loading department products from database...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !departmentInfo) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div style={basicStyles.container}>
          <div style={basicStyles.loading}>
            <h2 style={{ color: '#e53e3e', marginBottom: '0.5rem' }}>Error Loading Department</h2>
            <p style={{ color: '#718096', marginBottom: '1.5rem' }}>{error}</p>
            <Link to="/departments" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '1rem', textDecoration: 'none', background: '#edf2f7', color: '#4a5568', border: '1px solid #e2e8f0' }}>
              Back to Departments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={basicStyles.container}>
        {/* Breadcrumb Navigation */}
        <nav style={basicStyles.breadcrumb}>
          <Link to="/" style={basicStyles.breadcrumbLink}>Home</Link>
          <span style={basicStyles.separator}>›</span>
          <Link to="/departments" style={basicStyles.breadcrumbLink}>Departments</Link>
          <span style={basicStyles.separator}>›</span>
          <span style={basicStyles.current}>{departmentInfo?.name}</span>
        </nav>

        {error && (
          <div style={basicStyles.errorBanner}>
            <strong>Notice:</strong> {error}
          </div>
        )}

        {/* Department Header */}
        <header style={basicStyles.header}>
          <h1 style={basicStyles.title}>{departmentInfo?.name}</h1>
          <div style={basicStyles.stats}>
            <span style={basicStyles.totalProducts}>
              {pagination.totalItems?.toLocaleString() || 0} products
            </span>
            {departmentInfo?.stats && (
              <>
                <span style={basicStyles.statItem}>
                  Average Price: {formatPrice(departmentInfo.stats.averagePrice)}
                </span>
                <span style={basicStyles.statItem}>
                  Price Range: {formatPrice(departmentInfo.stats.minPrice)} - {formatPrice(departmentInfo.stats.maxPrice)}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Products Section */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#2d3748', margin: '0', fontWeight: '600' }}>Products</h2>
            <div style={{ color: '#718096', fontSize: '0.9rem' }}>
              Showing {((currentPage - 1) * pagination.limit) + 1}-{Math.min(currentPage * pagination.limit, pagination.totalItems)} of {pagination.totalItems} products
            </div>
          </div>

          {loadingProducts && (
            <div style={basicStyles.loadingOverlay}>
              <div style={basicStyles.spinner}></div>
            </div>
          )}

          <div style={{ ...basicStyles.productsGrid, opacity: loadingProducts ? 0.5 : 1, pointerEvents: loadingProducts ? 'none' : 'auto' }}>
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                style={basicStyles.productCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div style={basicStyles.productImage}>
                  <div style={basicStyles.imagePlaceholder}>
                    {product.name.charAt(0)}
                  </div>
                </div>
                <div style={basicStyles.productInfo}>
                  <h3 style={basicStyles.productName}>{product.name}</h3>
                  <div style={basicStyles.productDetails}>
                    <span style={basicStyles.productBrand}>{product.brand}</span>
                    <span style={basicStyles.productCategory}>{product.category}</span>
                  </div>
                  <div style={basicStyles.productPrice}>
                    {formatPrice(product.retail_price)}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={basicStyles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || loadingProducts}
                style={{
                  ...basicStyles.paginationButton,
                  ...(currentPage <= 1 || loadingProducts ? basicStyles.paginationButtonDisabled : {})
                }}
              >
                ← Previous
              </button>
              
              <div style={basicStyles.paginationInfo}>
                <span>
                  Page {currentPage} of {pagination.totalPages}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.totalPages || loadingProducts}
                style={{
                  ...basicStyles.paginationButton,
                  ...(currentPage >= pagination.totalPages || loadingProducts ? basicStyles.paginationButtonDisabled : {})
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {products.length === 0 && !loadingProducts && (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', marginTop: '2rem' }}>
            <h2 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>No Products Found</h2>
            <p style={{ color: '#718096', marginBottom: '1.5rem' }}>This department doesn't have any products available at the moment.</p>
            <Link to="/departments" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '1rem', textDecoration: 'none', background: '#edf2f7', color: '#4a5568', border: '1px solid #e2e8f0' }}>
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
