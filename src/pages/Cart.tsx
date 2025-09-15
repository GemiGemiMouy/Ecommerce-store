import React, { useContext, useState, useEffect } from "react";
import CartItem from "../components/CartItem";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { Product } from "../types";
import { fetchProducts } from "../services/api";

const Cart: React.FC = () => {
  const context = useContext(CartContext);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [shippingOption, setShippingOption] = useState("standard");
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  // Load recommendations when cart changes
  useEffect(() => {
    if (!context) return;
    
    const { cart } = context;
    const loadRecommendations = async () => {
      if (cart.length > 0) {
        setIsLoadingRecommendations(true);
        try {
          const allProducts = await fetchProducts();
          const cartCategories = Array.from(new Set(cart.map(item => item.category)));
          const recommended = allProducts
            .filter(product => 
              !cart.some(cartItem => cartItem.id === product.id) &&
              cartCategories.includes(product.category)
            )
            .slice(0, 4);
          setRecommendations(recommended);
        } catch (error) {
          console.error('Error loading recommendations:', error);
        } finally {
          setIsLoadingRecommendations(false);
        }
      }
    };

    loadRecommendations();
  }, [context]);

  if (!context) return <div className="p-4">Loading...</div>;

  const { cart, removeFromCart, updateQuantity, clearCart, addToCart } = context;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) : 0;
  const shippingCost = shippingOption === "express" ? 9.99 : shippingOption === "overnight" ? 19.99 : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shippingCost + tax;

  const handleApplyCoupon = () => {
    const validCoupons: {[key: string]: number} = {
      'SAVE10': 0.10,
      'WELCOME20': 0.20,
      'FREESHIP': 0.00, // Special case for free shipping
      'NEWUSER': 0.15
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      setAppliedCoupon({
        code: couponCode.toUpperCase(),
        discount: validCoupons[couponCode.toUpperCase()]
      });
      setCouponCode("");
    } else {
      alert('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const getShippingEstimate = () => {
    switch (shippingOption) {
      case "standard": return "5-7 business days";
      case "express": return "2-3 business days";
      case "overnight": return "Next business day";
      default: return "5-7 business days";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/90"></div>
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-left mb-6 lg:mb-0">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  Shopping Cart
                </h1>
                <p className="text-xl text-white/80">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              
              {cart.length > 0 && (
                <div className="flex items-center space-x-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
                    <span className="text-white font-semibold">Total: ${total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={clearCart}
                    className="group px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Clear Cart</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-16 text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Start shopping to add items to your cart. Discover amazing products and build your collection!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="group px-8 py-4 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-700 transition-all duration-300 flex items-center space-x-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Start Shopping</span>
              </Link>
              <Link
                to="/"
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-50 dark:bg-gray-700 transition-all duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  Cart Items ({cart.length})
                </h2>
                <div className="space-y-4">
                  {cart.map(item => (
                    <CartItem 
                      key={item.id} 
                      item={item} 
                      onRemove={removeFromCart}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    You might also like
                  </h3>
                  {isLoadingRecommendations ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {recommendations.map(product => (
                        <div key={product.id} className="group bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center space-x-4">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-16 h-16 object-cover rounded-xl"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">{product.title}</h4>
                              <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">{product.category}</p>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                                <button
                                  onClick={() => addToCart(product)}
                                  className="px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition-all duration-300"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8 h-fit">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                Order Summary
              </h2>
              
              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Coupon Code</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-700 dark:text-green-300 font-semibold">{appliedCoupon.code}</span>
                      <span className="text-green-600 dark:text-green-400 text-sm">
                        -{Math.round(appliedCoupon.discount * 100)}% off
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim()}
                      className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 disabled:text-gray-300"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Shipping Options */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Shipping Options</label>
                <div className="space-y-3">
                  {[
                    { value: "standard", label: "Standard Shipping", price: 0, description: "5-7 business days" },
                    { value: "express", label: "Express Shipping", price: 9.99, description: "2-3 business days" },
                    { value: "overnight", label: "Overnight Shipping", price: 19.99, description: "Next business day" }
                  ].map(option => (
                    <label key={option.value} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.value}
                        checked={shippingOption === option.value}
                        onChange={(e) => setShippingOption(e.target.value)}
                        className="mr-3 w-4 h-4 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 dark:text-white">{option.label}</span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {option.price === 0 ? 'Free' : `$${option.price.toFixed(2)}`}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full block text-center px-6 py-4 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
              >
                Proceed to Checkout
              </Link>
              
              <div className="text-center">
                <Link
                  to="/products"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
