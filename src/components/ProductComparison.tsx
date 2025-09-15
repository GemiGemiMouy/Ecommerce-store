import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { fetchProducts } from '../services/api';

interface ProductComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: Product[];
  onAddProduct: (product: Product) => void;
  onRemoveProduct: (productId: number) => void;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({
  isOpen,
  onClose,
  selectedProducts,
  onAddProduct,
  onRemoveProduct
}) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    fetchProducts().then(setAllProducts);
  }, []);

  const filteredProducts = allProducts.filter(product => 
    !selectedProducts.find(selected => selected.id === product.id) &&
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Comparison</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {selectedProducts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No products to compare</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Add products to start comparing their features</p>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-2xl hover:bg-purple-600 transition-all duration-300"
              >
                Add Products
              </button>
            </div>
          ) : (
            <div className="p-6">
              {/* Add Product Section */}
              {showAddProduct && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Product to Compare</h3>
                    <button
                      onClick={() => setShowAddProduct(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                    {filteredProducts.slice(0, 6).map(product => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                        onClick={() => {
                          onAddProduct(product);
                          setSearchTerm('');
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {product.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                        Features
                      </th>
                      {selectedProducts.map(product => (
                        <th key={product.id} className="text-center py-4 px-6 min-w-64">
                          <div className="relative">
                            <button
                              onClick={() => onRemoveProduct(product.id)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-32 h-32 object-cover rounded-2xl mx-auto mb-3"
                            />
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                              {product.title}
                            </h3>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                              ${product.price.toFixed(2)}
                            </p>
                            {product.isOnSale && product.originalPrice && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                ${product.originalPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">Category</td>
                      {selectedProducts.map(product => (
                        <td key={product.id} className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">
                          {product.category}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">Rating</td>
                      {selectedProducts.map(product => (
                        <td key={product.id} className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            {getRatingStars(product.rating || 0)}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {product.rating?.toFixed(1)} ({product.reviewCount} reviews)
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">Stock</td>
                      {selectedProducts.map(product => (
                        <td key={product.id} className="py-4 px-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            (product.stock || 0) > 10 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : (product.stock || 0) > 0
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {product.stock || 0} in stock
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">Description</td>
                      {selectedProducts.map(product => (
                        <td key={product.id} className="py-4 px-6 text-center text-gray-600 dark:text-gray-400 text-sm">
                          {product.description}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">Features</td>
                      {selectedProducts.map(product => (
                        <td key={product.id} className="py-4 px-6 text-center">
                          <div className="space-y-2">
                            {product.isNew && (
                              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold rounded-full">
                                New
                              </span>
                            )}
                            {product.isBestSeller && (
                              <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs font-semibold rounded-full">
                                Best Seller
                              </span>
                            )}
                            {product.isOnSale && (
                              <span className="inline-block px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-semibold rounded-full">
                                On Sale
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">Actions</td>
                      {selectedProducts.map(product => (
                        <td key={product.id} className="py-4 px-6 text-center">
                          <div className="space-y-2">
                            <button className="w-full px-4 py-2 bg-purple-500 text-white text-sm font-semibold rounded-xl hover:bg-purple-600 transition-colors">
                              Add to Cart
                            </button>
                            <button className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              View Details
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Add More Products Button */}
              {selectedProducts.length < 4 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="px-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-semibold rounded-2xl hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
                  >
                    + Add More Products ({4 - selectedProducts.length} remaining)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;
