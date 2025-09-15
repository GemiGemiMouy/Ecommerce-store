// src/components/ProductCard.tsx
import React, { useState, memo, useCallback } from "react";
import { Product } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<Props> = memo(({ product, onAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = useCallback(async () => {
    if (!product.stock || isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await onAddToCart(product);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, onAddToCart, isAddingToCart]);

  const handleWishlistToggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWishlistLoading(true);
    try {
      if (isWishlisted) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    } finally {
      setIsWishlistLoading(false);
    }
  }, [isWishlisted, product.id, removeFromWishlist, addToWishlist]);

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  }, [navigate, product.id]);

  const getStockStatus = () => {
    if (!product.stock || product.stock === 0) {
      return { text: 'Out of Stock', color: 'text-red-500', bgColor: 'bg-red-50' };
    }
    if (product.stock <= 5) {
      return { text: `Only ${product.stock} left`, color: 'text-orange-500', bgColor: 'bg-orange-50' };
    }
    return { text: 'In Stock', color: 'text-green-500', bgColor: 'bg-green-50' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:scale-[1.02]">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
        <Link to={`/product/${product.id}`}>
          {imageError ? (
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          ) : (
            <>
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              <img
                src={product.image}
                alt={product.title}
                className={`w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            </>
          )}
        </Link>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-600/50 uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        {/* Dynamic Sale Badge */}
        {product.isOnSale && product.discountPercentage && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg animate-pulse">
              -{product.discountPercentage}%
            </span>
          </div>
        )}

        {/* Additional Product Badges */}
        {product.isNew && (
          <div className="absolute top-4 right-16">
            <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-xl shadow-lg">
              NEW
            </span>
          </div>
        )}

        {product.isBestSeller && (
          <div className="absolute top-4 right-28">
            <span className="px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg">
              BEST
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 space-y-2">
          <button 
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className={`p-3 backdrop-blur-sm rounded-2xl shadow-lg hover:scale-110 transition-all duration-300 border ${
              isWishlisted 
                ? 'bg-red-500/95 text-white border-red-400/50' 
                : 'bg-white/95 dark:bg-gray-800/95 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-gray-600/50 hover:bg-white dark:hover:bg-gray-700'
            } ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlistLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            )}
          </button>
          <button 
            onClick={handleQuickView}
            className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200/50"
            title="Quick View"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors line-clamp-2 mb-3 group-hover:text-gray-700 dark:group-hover:text-gray-300 leading-tight">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Product Variants */}
        {product.variants && (product.variants.colors || product.variants.sizes) && (
          <div className="flex items-center space-x-3 mb-4">
            {product.variants.colors && product.variants.colors.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 font-medium">Colors:</span>
                <div className="flex space-x-1">
                  {product.variants.colors.slice(0, 4).map((color, index) => (
                    <div 
                      key={index}
                      className="w-4 h-4 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  {product.variants.colors.length > 4 && (
                    <span className="text-xs text-gray-400">+{product.variants.colors.length - 4}</span>
                  )}
                </div>
              </div>
            )}
            {product.variants.sizes && product.variants.sizes.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 font-medium">Sizes:</span>
                <div className="flex space-x-1">
                  {product.variants.sizes.slice(0, 3).map((size, index) => (
                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {size}
                    </span>
                  ))}
                  {product.variants.sizes.length > 3 && (
                    <span className="text-xs text-gray-400">+{product.variants.sizes.length - 3}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stock Status */}
        <div className="flex items-center justify-between mb-4">
          <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${stockStatus.bgColor} ${stockStatus.color}`}>
            {stockStatus.text}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
            ({product.rating || 0}) {product.reviewCount && `(${product.reviewCount})`}
          </span>
        </div>

        {/* Price and Add Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through font-medium">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.stock || isAddingToCart}
            className={`px-6 py-3 text-sm font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
              isAdded 
                ? 'bg-green-500 text-white shadow-green-200' 
                : 'bg-gray-900 text-white hover:bg-gray-700 shadow-gray-200'
            } ${(!product.stock || isAddingToCart) ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={`Add ${product.title} to cart`}
          >
            {isAddingToCart ? (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Adding...</span>
              </div>
            ) : isAdded ? (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Added</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span>{!product.stock ? 'Out of Stock' : 'Add'}</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;