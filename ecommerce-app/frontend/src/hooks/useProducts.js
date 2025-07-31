import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await productService.getProducts(params);
      
      setProducts(data.products || []);
      setTotalPages(data.pagination?.totalPages || 0);
      setTotalProducts(data.pagination?.totalProducts || 0);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [categoriesData, brandsData, priceRangeData] = await Promise.all([
        productService.getCategories(),
        productService.getBrands(),
        productService.getPriceRange(),
      ]);

      setCategories(categoriesData.categories || []);
      setBrands(brandsData.brands || []);
      
      if (priceRangeData.min !== undefined && priceRangeData.max !== undefined) {
        setPriceRange([priceRangeData.min, priceRangeData.max]);
      }
    } catch (err) {
      console.error('Failed to fetch metadata:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [params.page, params.limit, params.sortBy, params.sortOrder]);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    totalPages,
    totalProducts,
    categories,
    brands,
    priceRange,
    refetch,
  };
};
