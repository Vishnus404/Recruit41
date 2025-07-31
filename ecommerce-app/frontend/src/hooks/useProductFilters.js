import { useState, useEffect, useMemo } from 'react';

export const useProductFilters = (products = []) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    priceMin: 0,
    priceMax: 1000,
    inStock: false,
    onSale: false,
  });

  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }

    return products.filter((product) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          product.product_name?.toLowerCase().includes(searchTerm) ||
          product.brand?.toLowerCase().includes(searchTerm) ||
          product.category?.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Brand filter
      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }

      // Price range filter
      const price = product.retail_price || 0;
      if (price < filters.priceMin || price > filters.priceMax) {
        return false;
      }

      // In stock filter
      if (filters.inStock && product.inventory_count <= 0) {
        return false;
      }

      // On sale filter
      if (filters.onSale && (!product.discount_percentage || product.discount_percentage <= 0)) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      priceMin: 0,
      priceMax: 1000,
      inStock: false,
      onSale: false,
    });
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search ||
      filters.category ||
      filters.brand ||
      filters.priceMin > 0 ||
      filters.priceMax < 1000 ||
      filters.inStock ||
      filters.onSale
    );
  }, [filters]);

  return {
    filters,
    filteredProducts,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  };
};
