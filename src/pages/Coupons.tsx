import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
  category?: string;
  usageLimit?: number;
  usedCount: number;
}

const Coupons: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showExpired, setShowExpired] = useState(false);

  // Mock coupons data
  const mockCoupons: Coupon[] = [
    {
      id: '1',
      code: 'WELCOME20',
      title: 'Welcome Discount',
      description: 'Get 20% off on your first order',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 50,
      maxDiscount: 100,
      expiryDate: '2024-12-31',
      isActive: true,
      category: 'general',
      usageLimit: 1000,
      usedCount: 234
    },
    {
      id: '2',
      code: 'SAVE50',
      title: 'Big Savings',
      description: 'Save $50 on orders over $200',
      discountType: 'fixed',
      discountValue: 50,
      minOrderAmount: 200,
      expiryDate: '2024-11-30',
      isActive: true,
      category: 'electronics',
      usageLimit: 500,
      usedCount: 89
    },
    {
      id: '3',
      code: 'FREESHIP',
      title: 'Free Shipping',
      description: 'Free shipping on all orders',
      discountType: 'fixed',
      discountValue: 15,
      minOrderAmount: 25,
      expiryDate: '2024-10-15',
      isActive: true,
      category: 'shipping',
      usageLimit: 2000,
      usedCount: 567
    },
    {
      id: '4',
      code: 'FLASH30',
      title: 'Flash Sale',
      description: '30% off on selected items',
      discountType: 'percentage',
      discountValue: 30,
      minOrderAmount: 75,
      maxDiscount: 150,
      expiryDate: '2024-09-20',
      isActive: false,
      category: 'fashion',
      usageLimit: 300,
      usedCount: 300
    }
  ];

  useEffect(() => {
    setCoupons(mockCoupons);
  }, []);

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🏷️' },
    { value: 'general', label: 'General', icon: '🎯' },
    { value: 'electronics', label: 'Electronics', icon: '📱' },
    { value: 'fashion', label: 'Fashion', icon: '👕' },
    { value: 'shipping', label: 'Shipping', icon: '🚚' }
  ];

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || coupon.category === selectedCategory;
    const matchesExpiry = showExpired || new Date(coupon.expiryDate) > new Date();
    
    return matchesSearch && matchesCategory && matchesExpiry;
  });

  const handleApplyCoupon = (couponCode: string) => {
    if (appliedCoupons.includes(couponCode)) {
      setAppliedCoupons(prev => prev.filter(code => code !== couponCode));
    } else {
      setAppliedCoupons(prev => [...prev, couponCode]);
    }
  };

  const isCouponExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const isCouponUsedUp = (coupon: Coupon) => {
    return coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
  };

  const getDiscountText = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    } else {
      return `$${coupon.discountValue} OFF`;
    }
  };

  const getCouponStatus = (coupon: Coupon) => {
    if (!coupon.isActive) return 'expired';
    if (isCouponExpired(coupon.expiryDate)) return 'expired';
    if (isCouponUsedUp(coupon)) return 'used-up';
    return 'active';
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-3xl shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-indigo-900/90"></div>
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-left mb-6 lg:mb-0">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  🎫 Coupons & Discounts
                </h1>
                <p className="text-xl text-gray-300">Save more with our exclusive offers</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-white dark:bg-gray-800/10 backdrop-blur-sm rounded-2xl px-6 py-3">
                  <span className="text-white font-semibold">{filteredCoupons.length} Available</span>
                </div>
                <button
                  onClick={() => navigate('/cart')}
                  className="group px-6 py-3 bg-white dark:bg-gray-800/10 backdrop-blur-sm text-white font-semibold rounded-2xl hover:bg-white dark:bg-gray-800/20 transition-all duration-300 border border-white/20"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>View Cart</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search coupons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Show Expired Toggle */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showExpired}
                  onChange={(e) => setShowExpired(e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  showExpired ? 'bg-purple-500' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white dark:bg-gray-800 rounded-full transition-transform duration-300 ${
                    showExpired ? 'transform translate-x-6' : ''
                  }`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">Show Expired</span>
              </label>
            </div>
          </div>
        </div>

        {/* Applied Coupons */}
        {appliedCoupons.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-3xl p-6 mb-8">
            <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Applied Coupons
            </h3>
            <div className="flex flex-wrap gap-2">
              {appliedCoupons.map(code => (
                <span
                  key={code}
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-xl font-semibold flex items-center"
                >
                  {code}
                  <button
                    onClick={() => handleApplyCoupon(code)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map(coupon => {
            const status = getCouponStatus(coupon);
            const isApplied = appliedCoupons.includes(coupon.code);
            
            return (
              <div
                key={coupon.id}
                className={`group relative bg-white dark:bg-gray-800 rounded-3xl border-2 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  status === 'active' 
                    ? 'border-purple-200 hover:border-purple-300' 
                    : 'border-gray-200 opacity-60'
                }`}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {status === 'active' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Active
                    </span>
                  )}
                  {status === 'expired' && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                      Expired
                    </span>
                  )}
                  {status === 'used-up' && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
                      Used Up
                    </span>
                  )}
                </div>

                {/* Coupon Code */}
                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{coupon.code}</div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {getDiscountText(coupon)}
                  </div>
                </div>

                {/* Coupon Details */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{coupon.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{coupon.description}</p>
                  
                  {coupon.minOrderAmount && (
                    <p className="text-sm text-gray-500">
                      Min. order: ${coupon.minOrderAmount}
                    </p>
                  )}
                  
                  {coupon.maxDiscount && (
                    <p className="text-sm text-gray-500">
                      Max. discount: ${coupon.maxDiscount}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-500">
                    Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Usage Progress */}
                {coupon.usageLimit && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Usage</span>
                      <span>{coupon.usedCount}/{coupon.usageLimit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Apply Button */}
                <button
                  onClick={() => handleApplyCoupon(coupon.code)}
                  disabled={status !== 'active'}
                  className={`w-full py-3 font-semibold rounded-2xl transition-all duration-300 ${
                    isApplied
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : status === 'active'
                        ? 'bg-purple-500 text-white hover:bg-purple-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isApplied ? 'Applied ✓' : status === 'active' ? 'Apply Coupon' : 'Unavailable'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCoupons.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No coupons found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Try adjusting your search or filters to find more coupons and discounts.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setShowExpired(false);
              }}
              className="px-8 py-4 bg-purple-500 text-white font-semibold rounded-2xl hover:bg-purple-600 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;
