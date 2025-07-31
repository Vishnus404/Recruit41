// Department API Service
const API_BASE_URL = 'http://localhost:3000/api';

export const departmentService = {
  // Get all departments with product counts
  getAllDepartments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch departments');
      }
      
      return data.departments;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  // Get specific department details
  getDepartmentById: async (departmentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments/${departmentId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Department not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch department details');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching department details:', error);
      throw error;
    }
  },

  // Get products in a department with pagination
  getDepartmentProducts: async (departmentId, page = 1, limit = 12) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/departments/${departmentId}/products?page=${page}&limit=${limit}`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Department not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch department products');
      }
      
      return {
        departmentName: data.department,
        departmentInfo: data.departmentInfo,
        products: data.products,
        pagination: data.pagination
      };
    } catch (error) {
      console.error('Error fetching department products:', error);
      throw error;
    }
  }
};

export default departmentService;
