import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import departmentService from '../services/departmentService';
// import '../styles/DepartmentListPage.css'; // Temporarily commented out

const DepartmentListPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('DepartmentListPage component rendered');

  useEffect(() => {
    console.log('DepartmentListPage useEffect triggered');
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting to fetch departments...');
      
      // Try to fetch from API first
      try {
        const departmentData = await departmentService.getAllDepartments();
        console.log('Department data received:', departmentData);
        setDepartments(departmentData);
      } catch (apiError) {
        console.warn('API failed, using mock data:', apiError);
        // Fallback to mock data if API fails
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
      }
    } catch (err) {
      console.error('Failed to fetch departments:', err);
      setError(`Error: ${err.message}. Using mock data for now.`);
      // Even if everything fails, show mock data
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="department-list-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading departments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="department-list-page">
        <div className="error-container">
          <h2>Error Loading Departments</h2>
          <p>{error}</p>
          <button onClick={fetchDepartments} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="department-list-page">
      <div className="container">
        <header className="page-header">
          <h1>Shop by Department</h1>
          <p>Browse our product categories</p>
        </header>

        {/* Debug Information */}
        <div style={{ background: '#f0f0f0', padding: '1rem', margin: '1rem 0', borderRadius: '8px' }}>
          <h3>Debug Info:</h3>
          <p>Loading: {loading ? 'true' : 'false'}</p>
          <p>Error: {error || 'none'}</p>
          <p>Departments count: {departments.length}</p>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading departments...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <h2>Error Loading Departments</h2>
            <p>{error}</p>
            <button onClick={fetchDepartments} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="departments-grid">
            {departments.map((department) => (
              <Link 
                key={department._id} 
                to={`/departments/${department._id}`}
                className="department-card"
              >
                <div className="department-content">
                  <h2 className="department-name">{department.name}</h2>
                  <div className="department-stats">
                    <span className="product-count">
                      {department.productCount.toLocaleString()} products
                    </span>
                  </div>
                  <div className="department-description">
                    <p>Discover our {department.name.toLowerCase()} collection</p>
                  </div>
                  <div className="browse-button">
                    Browse {department.name} →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && departments.length === 0 && (
          <div className="no-departments">
            <h2>No Departments Available</h2>
            <p>Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentListPage;
