import React, { createContext, useContext, useState } from 'react';
import { Product, SearchResult } from '../types';
import { fetchProducts } from '../services/api';

interface SearchContextType {
  searchQuery: string;
  searchResults: SearchResult | null;
  isSearching: boolean;
  searchProducts: (query: string, filters?: {
    category?: string;
    priceRange?: string;
    rating?: number;
  }) => Promise<void>;
  clearSearch: () => void;
  setSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchProducts = async (query: string, filters?: {
    category?: string;
    priceRange?: string;
    rating?: number;
  }) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const allProducts = await fetchProducts();
      
      // Filter products based on search query
      let filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );

      // Apply additional filters
      if (filters?.category && filters.category !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }

      if (filters?.priceRange && filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        filteredProducts = filteredProducts.filter(p => p.price >= min && p.price <= max);
      }

      if (filters?.rating) {
        filteredProducts = filteredProducts.filter(p => (p.rating || 0) >= filters.rating!);
      }

      const result: SearchResult = {
        products: filteredProducts,
        total: filteredProducts.length,
        query,
        filters: filters || {}
      };

      setSearchResults(result);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({
        products: [],
        total: 0,
        query,
        filters: filters || {}
      });
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      searchResults,
      isSearching,
      searchProducts,
      clearSearch,
      setSearchQuery
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
