import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DepartmentListPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('DepartmentListPage component mounted');
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      console.log('Fetching departments from API...');
      const response = await fetch('http://localhost:3000/api/departments');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success) {
        setDepartments(data.departments);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch departments');
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(err.message);
      // Set fallback mock data for testing
      setDepartments([
        { _id: 'mock-men', name: 'Men', productCount: 100 },
        { _id: 'mock-women', name: 'Women', productCount: 200 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  console.log('Component render state:', { loading, error, departmentsCount: departments.length });

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div>Loading departments...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa', 
      padding: '2rem' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: '#2d3748', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Shop by Department
        </h1>
        
        {error && (
          <div style={{
            background: '#fed7d7',
            color: '#c53030',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Error: {error} (Using fallback data)
          </div>
        )}

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
                padding: '2rem',
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s'
              }}
            >
              <h2 style={{
                fontSize: '1.8rem',
                color: '#2d3748',
                marginBottom: '1rem'
              }}>
                {department.name}
              </h2>
              <p style={{
                color: '#718096',
                fontSize: '1.1rem'
              }}>
                {department.productCount?.toLocaleString() || 0} products
              </p>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/" style={{
            color: '#4299e1',
            textDecoration: 'none',
            fontSize: '1.1rem'
          }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DepartmentListPage;
