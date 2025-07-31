import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DepartmentListPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading and set mock data
    const timer = setTimeout(() => {
      const mockDepartments = [
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Men',
          productCount: 13118
        },
        {
          _id: '507f1f77bcf86cd799439012', 
          name: 'Women',
          productCount: 15976
        }
      ];
      setDepartments(mockDepartments);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const basicStyles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    title: {
      fontSize: '2.5rem',
      color: '#2d3748',
      marginBottom: '0.5rem',
      fontWeight: '700'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#718096',
      margin: '0'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      textDecoration: 'none',
      color: 'inherit',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease'
    },
    cardTitle: {
      fontSize: '1.8rem',
      color: '#2d3748',
      marginBottom: '1rem',
      fontWeight: '600'
    },
    productCount: {
      display: 'inline-block',
      background: '#edf2f7',
      color: '#4a5568',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '500',
      marginBottom: '1rem'
    },
    description: {
      color: '#718096',
      fontSize: '1rem',
      lineHeight: '1.5',
      marginBottom: '1.5rem'
    },
    browseButton: {
      color: '#4299e1',
      fontWeight: '600',
      fontSize: '1rem'
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
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div style={basicStyles.container}>
          <div style={basicStyles.loading}>
            <div style={basicStyles.spinner}></div>
            <p>Loading departments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={basicStyles.container}>
        <header style={basicStyles.header}>
          <h1 style={basicStyles.title}>Shop by Department</h1>
          <p style={basicStyles.subtitle}>Browse our product categories</p>
        </header>

        <div style={basicStyles.grid}>
          {departments.map((department) => (
            <Link 
              key={department._id} 
              to={`/departments/${department._id}`}
              style={basicStyles.card}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
              }}
            >
              <div>
                <h2 style={basicStyles.cardTitle}>{department.name}</h2>
                <div>
                  <span style={basicStyles.productCount}>
                    {department.productCount.toLocaleString()} products
                  </span>
                </div>
                <div style={basicStyles.description}>
                  <p>Discover our {department.name.toLowerCase()} collection</p>
                </div>
                <div style={basicStyles.browseButton}>
                  Browse {department.name} →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {departments.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
            <h2 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>No Departments Available</h2>
            <p style={{ color: '#718096' }}>Please check back later.</p>
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

export default DepartmentListPage;
