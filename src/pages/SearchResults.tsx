import React, { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Product } from "../types";

const SearchResults: React.FC = () => {
  const { searchResults, isSearching, searchProducts } = useSearch();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q') || '';
    setSearchQuery(query);
    
    if (query) {
      searchProducts(query);
    }
  }, [location.search, searchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchProducts(searchQuery.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Search Products</h1>
            <p className="text-gray-600 dark:text-gray-400">Find exactly what you're looking for</p>
          </div>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="w-full pl-16 pr-6 py-5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50 dark:bg-gray-900 focus:bg-white dark:bg-gray-800 transition-all duration-300 text-xl placeholder-gray-500 shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-300 flex items-center space-x-2 group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </form>
          
          {/* Quick Search Suggestions */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-center text-sm font-medium text-gray-700 mb-4">Popular Searches</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Electronics", "Clothing", "Accessories", "Shoes", "Watches", "Laptops", "Phones", "Headphones"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    searchProducts(suggestion);
                  }}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 hover:scale-105 font-medium"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results */}
        {isSearching ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-lg p-16 text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900 mx-auto mb-6"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Searching...</h3>
            <p className="text-gray-600 dark:text-gray-400">Finding the best products for you</p>
          </div>
        ) : searchResults ? (
          <div>
            {/* Results Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-lg p-8 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Search Results for "{searchResults.query}"
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {searchResults.total} {searchResults.total === 1 ? 'product' : 'products'} found
                  </p>
                </div>
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Results updated</span>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {searchResults.products.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-lg p-16 text-center">
                <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No products found</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto text-lg">
                  We couldn't find any products matching "<span className="font-semibold text-gray-800">{searchResults.query}</span>". 
                  Try different keywords or browse our categories.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 dark:bg-gray-900 hover:border-gray-400 transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Clear Search</span>
                  </button>
                  <button
                    onClick={() => window.location.href = '/products'}
                    className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>Browse All Products</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {searchResults.products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={() => {}} 
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-lg p-16 text-center">
            <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Start your search</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto text-lg">
              Enter a product name, category, or description to find what you're looking for. 
              Use our popular search suggestions to get started.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Electronics", "Clothing", "Accessories", "Shoes"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    searchProducts(suggestion);
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 hover:scale-105 font-medium"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
