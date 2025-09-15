import React, { useState } from "react";
import { CartItem as CartItemType } from "../types";
import { Link } from "react-router-dom";

interface Props {
  item: CartItemType;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

const CartItem: React.FC<Props> = ({ item, onRemove, onUpdateQuantity }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const [tempQuantity, setTempQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (item.stock || 999)) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(item.id);
    }, 300);
  };

  const handleQuantityInputSubmit = () => {
    if (tempQuantity >= 1 && tempQuantity <= (item.stock || 999)) {
      onUpdateQuantity(item.id, tempQuantity);
      setShowQuantityInput(false);
    }
  };

  const handleQuantityInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuantityInputSubmit();
    } else if (e.key === 'Escape') {
      setTempQuantity(item.quantity);
      setShowQuantityInput(false);
    }
  };

  return (
    <div className={`group bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500 ${
      isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
        {/* Product Image and Info */}
        <div className="flex items-center space-x-4 flex-1">
          <Link to={`/product/${item.id}`} className="relative group/image">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-2xl shadow-md group-hover/image:shadow-lg transition-all duration-300" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 rounded-2xl transition-all duration-300"></div>
          </Link>
          
          <div className="flex-1 min-w-0">
            <Link to={`/product/${item.id}`} className="block group/title">
              <h4 className="font-bold text-gray-900 dark:text-white text-lg lg:text-xl line-clamp-2 group-hover/title:text-gray-600 dark:group-hover/title:text-gray-300 transition-colors">
                {item.title}
              </h4>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 capitalize">{item.category}</p>
            
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-gray-900 dark:text-white font-bold text-lg">${item.price.toFixed(2)}</span>
              {item.isOnSale && item.originalPrice && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
              )}
            </div>
            
            {/* Stock Warning */}
            {(item.stock || 0) <= 5 && (item.stock || 0) > 0 && (
              <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>Only {item.stock} left in stock!</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Quantity and Price Controls */}
        <div className="flex items-center space-x-6 w-full lg:w-auto">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={item.quantity <= 1}
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>
            
            {showQuantityInput ? (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={tempQuantity}
                  onChange={(e) => setTempQuantity(parseInt(e.target.value) || 1)}
                  onKeyDown={handleQuantityInputKeyPress}
                  onBlur={handleQuantityInputSubmit}
                  min="1"
                  max={item.stock || 999}
                  className="w-16 px-2 py-1 text-center bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                  autoFocus
                />
                <button
                  onClick={handleQuantityInputSubmit}
                  className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setTempQuantity(item.quantity);
                  setShowQuantityInput(true);
                }}
                className="w-16 h-10 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-500"
              >
                <span className="font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
              </button>
            )}
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={item.quantity >= (item.stock || 999)}
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          
          {/* Total Price */}
          <div className="text-right min-w-[100px]">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            {item.quantity > 1 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                ${item.price.toFixed(2)} each
              </div>
            )}
          </div>
          
          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="group/remove p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 border border-red-200 dark:border-red-800"
            title="Remove from cart"
          >
            <svg className="w-5 h-5 group-hover/remove:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
