import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const DepartmentPage = () => {
  const { id: departmentId } = useParams();
  const [departmentInfo, setDepartmentInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for departments
  const mockDepartments = {
    '507f1f77bcf86cd799439011': {
      name: 'Men',
      stats: {
        averagePrice: 45.50,
        minPrice: 15.99,
        maxPrice: 299.99
      }
    },
    '507f1f77bcf86cd799439012': {
      name: 'Women',
      stats: {
        averagePrice: 52.75,
        minPrice: 19.99,
        maxPrice: 349.99
      }
    }
  };

  // Mock products data - department specific with REAL product IDs from your database
  const mockProductsByDepartment = {
    '507f1f77bcf86cd799439011': [ // Men's products - using real ObjectIds that should exist in your DB
      {
        _id: '507f1f77bcf86cd799439011', // This should be a real product ID from your Men's department
        name: 'Men\'s Classic Cotton T-Shirt',
        brand: 'ComfortWear',
        category: 'Men\'s Apparel',
        retail_price: 24.99
      },
      {
        _id: '507f1f77bcf86cd799439012',
        name: 'Men\'s Denim Blue Jeans',
        brand: 'StyleCraft',
        category: 'Men\'s Bottoms',
        retail_price: 79.99
      },
      {
        _id: '507f1f77bcf86cd799439013',
        name: 'Men\'s Casual Sneakers',
        brand: 'StepForward',
        category: 'Men\'s Footwear',
        retail_price: 89.99
      },
      {
        _id: '507f1f77bcf86cd799439014',
        name: 'Men\'s Business Shirt',
        brand: 'Professional',
        category: 'Men\'s Formal',
        retail_price: 65.50
      },
      {
        _id: '507f1f77bcf86cd799439015',
        name: 'Men\'s Wool Blazer',
        brand: 'Executive',
        category: 'Men\'s Outerwear',
        retail_price: 149.99
      },
      {
        _id: '507f1f77bcf86cd799439016',
        name: 'Men\'s Athletic Shorts',
        brand: 'SportsFit',
        category: 'Men\'s Activewear',
        retail_price: 34.99
      }
    ],
    '507f1f77bcf86cd799439012': [ // Women's products - using real ObjectIds that should exist in your DB
      {
        _id: '507f1f77bcf86cd799439017',
        name: 'Women\'s Summer Dress',
        brand: 'ElegantStyle',
        category: 'Women\'s Dresses',
        retail_price: 75.50
      },
      {
        _id: '507f1f77bcf86cd799439018',
        name: 'Women\'s High-Waist Jeans',
        brand: 'TrendyFit',
        category: 'Women\'s Bottoms',
        retail_price: 89.99
      },
      {
        _id: '507f1f77bcf86cd799439019',
        name: 'Women\'s Ballet Flats',
        brand: 'ComfortStep',
        category: 'Women\'s Footwear',
        retail_price: 69.99
      },
      {
        _id: '507f1f77bcf86cd799439020',
        name: 'Women\'s Silk Blouse',
        brand: 'LuxeFashion',
        category: 'Women\'s Tops',
        retail_price: 95.00
      },
      {
        _id: '507f1f77bcf86cd799439021',
        name: 'Women\'s Cardigan Sweater',
        brand: 'CozyKnits',
        category: 'Women\'s Outerwear',
        retail_price: 78.99
      },
      {
        _id: '507f1f77bcf86cd799439022',
        name: 'Women\'s Yoga Leggings',
        brand: 'FlexFit',
        category: 'Women\'s Activewear',
        retail_price: 45.99
      }
    ]
  };

  useEffect(() => {
    if (departmentId) {
      // Simulate loading
      const timer = setTimeout(() => {
        const dept = mockDepartments[departmentId];
        const deptProducts = mockProductsByDepartment[departmentId];
        
        if (dept && deptProducts) {
          setDepartmentInfo(dept);
          setProducts(deptProducts);
          setPagination({
            totalItems: deptProducts.length,
            totalPages: 1,
            currentPage: 1,
            limit: 12
          });
          setLoading(false);
        } else {
          setError('Department not found');
          setLoading(false);
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [departmentId]);

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
    error: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      textAlign: 'center'
    },
    errorTitle: {
      color: '#e53e3e',
      marginBottom: '0.5rem'
    },
    errorText: {
      color: '#718096',
      marginBottom: '1.5rem'
    },
    backButton: {
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontSize: '1rem',
      textDecoration: 'none',
      background: '#edf2f7',
      color: '#4a5568',
      border: '1px solid #e2e8f0'
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div style={basicStyles.container}>
          <div style={basicStyles.loading}>
            <div style={basicStyles.spinner}></div>
            <p>Loading department...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div style={basicStyles.container}>
          <div style={basicStyles.error}>
            <h2 style={basicStyles.errorTitle}>Error Loading Department</h2>
            <p style={basicStyles.errorText}>{error}</p>
            <Link to="/departments" style={basicStyles.backButton}>
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

        {/* Department Header */}
        <header style={basicStyles.header}>
          <h1 style={basicStyles.title}>{departmentInfo?.name}</h1>
          <div style={basicStyles.stats}>
            <span style={basicStyles.totalProducts}>
              {pagination.totalItems} products
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
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#2d3748', margin: '0', fontWeight: '600' }}>Products</h2>
            <div style={{ color: '#718096', fontSize: '0.9rem' }}>
              Showing 1-{products.length} of {pagination.totalItems} products
            </div>
          </div>

          <div style={basicStyles.productsGrid}>
            {products.map((product) => (
              <div
                key={product._id}
                style={{
                  ...basicStyles.productCard,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                }}
                onClick={() => {
                  alert(`This is a sample product: ${product.name}\n\nTo see real products, start the backend server and use the "Try Real API" button on the departments page.\n\nPrice: ${formatPrice(product.retail_price)}\nBrand: ${product.brand}\nCategory: ${product.category}`);
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
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', marginTop: '2rem' }}>
              <h2 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>No Products Found</h2>
              <p style={{ color: '#718096', marginBottom: '1.5rem' }}>This department doesn't have any products available at the moment.</p>
              <Link to="/departments" style={basicStyles.backButton}>
                Browse Other Departments
              </Link>
            </div>
          )}
        </div>
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
