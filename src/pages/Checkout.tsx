import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Address } from "../types";
import { fetchUserAddresses } from "../services/api";

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

const Checkout: React.FC = () => {
  const context = useContext(CartContext);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const shippingOptions: ShippingOption[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Regular delivery with tracking',
      price: 0,
      estimatedDays: '5-7 business days'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Faster delivery with priority handling',
      price: 9.99,
      estimatedDays: '2-3 business days'
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      description: 'Next business day delivery',
      price: 19.99,
      estimatedDays: '1 business day'
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadAddresses();
  }, [isAuthenticated, navigate]);

  if (!context) return <div className="p-4">Loading...</div>;

  const { cart, clearCart } = context;

  const loadAddresses = async () => {
    if (!user) return;
    
    try {
      const addressesData = await fetchUserAddresses(user.id);
      setAddresses(addressesData);
      if (addressesData.length > 0) {
        setSelectedAddress(addressesData.find(addr => addr.isDefault) || addressesData[0]);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress || !selectedShipping) {
      alert('Please select a shipping address and method');
      return;
    }
    
    // In a real app, this would process the payment
    alert("Order placed successfully!");
    clearCart();
    navigate('/');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = selectedShipping?.price || 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white dark:text-white mb-2">Checkout</h1>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400 text-lg">Complete your order securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-900 dark:text-white">
                      {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white border-t pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout Information</h2>
              
              {/* Shipping Address Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping Address</h3>
                  <Link
                    to="/shipping"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white text-sm font-medium"
                  >
                    Manage Addresses
                  </Link>
                </div>
                
                {addresses.length === 0 ? (
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No addresses saved</p>
                    <Link
                      to="/shipping"
                      className="px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-300"
                    >
                      Add Address
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map(address => (
                      <label
                        key={address.id}
                        className={`block p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          selectedAddress?.id === address.id 
                            ? 'border-gray-900 bg-gray-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
            <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddress?.id === address.id}
                          onChange={() => setSelectedAddress(address)}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold text-gray-900 dark:text-white capitalize">{address.type}</span>
                              {address.isDefault && (
                                <span className="px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 text-sm">
                              <p>{address.firstName} {address.lastName}</p>
                              <p>{address.address1}</p>
                              {address.address2 && <p>{address.address2}</p>}
                              <p>{address.city}, {address.state} {address.zipCode}</p>
                              <p>{address.phone}</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
          </div>

              {/* Shipping Method Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping Method</h3>
                <div className="space-y-3">
                  {shippingOptions.map(option => (
                    <label
                      key={option.id}
                      className={`block p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedShipping?.id === option.id 
                          ? 'border-gray-900 bg-gray-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
            <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={selectedShipping?.id === option.id}
                        onChange={() => setSelectedShipping(option)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{option.name}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{option.description}</p>
                          <p className="text-gray-500 text-sm">{option.estimatedDays}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">
                            {option.price === 0 ? 'Free' : `$${option.price}`}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="payment" value="card" className="mr-3" defaultChecked />
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">Credit/Debit Card</span>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="payment" value="paypal" className="mr-3" />
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.105-.633c-.984-5.05-4.35-6.797-8.647-6.797H9.342a.641.641 0 0 0-.633.74l1.12 7.106h4.634c.524 0 .968-.382 1.05-.9l1.12-7.106h2.19c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287z"/>
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">PayPal</span>
                    </div>
                  </label>
          </div>
          </div>

              {/* Submit Button */}
          <button
                onClick={handleSubmit}
                disabled={!selectedAddress || !selectedShipping}
                className="w-full py-4 bg-gray-900 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-gray-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
                Complete Order
          </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
