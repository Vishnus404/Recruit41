import api from './api';

export const productService = {
  // Get all products with pagination and filtering
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get product categories
  getCategories: async () => {
    try {
      const response = await api.get('/products/categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get product brands
  getBrands: async () => {
    try {
      const response = await api.get('/products/brands');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    try {
      const response = await api.get('/products/search', {
        params: { q: query, ...params }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category, params = {}) => {
    try {
      const response = await api.get('/products', {
        params: { category, ...params }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get products by brand
  getProductsByBrand: async (brand, params = {}) => {
    try {
      const response = await api.get('/products', {
        params: { brand, ...params }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get price range for products
  getPriceRange: async () => {
    try {
      const response = await api.get('/products/price-range');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all departments
  getDepartments: async (includeStats = false) => {
    try {
      const response = await api.get('/departments', {
        params: { includeStats }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get products by department ID
  getProductsByDepartmentId: async (departmentId, params = {}) => {
    try {
      const response = await api.get(`/departments/${departmentId}/products`, {
        params
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productService;
