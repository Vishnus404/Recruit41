import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import departmentService from '../services/departmentService';

const DepartmentListPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching departments from API...');
      
      const departmentData = await departmentService.getAllDepartments();
      console.log('Department data received:', departmentData);
      setDepartments(departmentData);
      
    } catch (err) {
      console.error('Failed to fetch departments:', err);
      setError(`Failed to load departments: ${err.message}`);
    } finally {
      setLoading(false);
    }
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
          <p>Loading departments from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
          <h2 style={{ color: '#e53e3e', marginBottom: '1rem' }}>Error Loading Departments</h2>
          <p style={{ color: '#718096', marginBottom: '1.5rem' }}>{error}</p>
          <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Make sure your backend server is running on http://localhost:3000
          </p>
          <button 
            onClick={fetchDepartments}
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
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#2d3748', marginBottom: '0.5rem', fontWeight: '700' }}>
            Shop by Department
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#718096', margin: '0' }}>
            Browse our product categories
          </p>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem', 
          marginBottom: '2rem' 
        }}>
          {departments.map((department) => (
            <Link 
              key={department._id} 
              to={`/departments/${department._id}`}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                display: 'block'
              }}
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
                <h2 style={{ 
                  fontSize: '1.8rem', 
                  color: '#2d3748', 
                  marginBottom: '1rem', 
                  fontWeight: '600' 
                }}>
                  {department.name}
                </h2>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#4299e1',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    {department.productCount.toLocaleString()} products
                  </span>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ color: '#718096', fontSize: '1rem', lineHeight: '1.5', margin: '0' }}>
                    Discover our {department.name.toLowerCase()} collection
                  </p>
                </div>
                <div style={{ color: '#4299e1', fontWeight: '600', fontSize: '1rem' }}>
                  Browse {department.name} →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {departments.length === 0 && !loading && !error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            background: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' 
          }}>
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
