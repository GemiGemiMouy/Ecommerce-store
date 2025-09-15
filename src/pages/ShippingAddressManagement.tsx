import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Address } from "../types";
import { fetchUserAddresses, addUserAddress } from "../services/api";

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: string;
}

interface DeliveryEstimate {
  address: string;
  estimatedDelivery: string;
  shippingMethod: string;
  cost: number;
}

const ShippingAddressManagement: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [deliveryEstimate, setDeliveryEstimate] = useState<DeliveryEstimate | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    type: 'home',
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    isDefault: false
  });

  const shippingOptions: ShippingOption[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Regular delivery with tracking',
      price: 0,
      estimatedDays: '5-7 business days',
      icon: 'standard'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Faster delivery with priority handling',
      price: 9.99,
      estimatedDays: '2-3 business days',
      icon: 'express'
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      description: 'Next business day delivery',
      price: 19.99,
      estimatedDays: '1 business day',
      icon: 'overnight'
    },
    {
      id: 'pickup',
      name: 'Store Pickup',
      description: 'Pick up at nearest GeminiStore location',
      price: 0,
      estimatedDays: 'Same day',
      icon: 'pickup'
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadAddresses();
  }, [isAuthenticated, navigate]);

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

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const address = await addUserAddress(user.id, newAddress);
      setAddresses(prev => [...prev, address]);
      setIsAddingAddress(false);
      setNewAddress({
        type: 'home',
        firstName: '',
        lastName: '',
        company: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        phone: '',
        isDefault: false
      });
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const calculateDeliveryEstimate = (address: Address, shipping: ShippingOption) => {
    // Mock delivery calculation based on address and shipping method
    const baseDays = shipping.id === 'standard' ? 5 : shipping.id === 'express' ? 2 : shipping.id === 'overnight' ? 1 : 0;
    const zipCode = address.zipCode;
    
    // Mock logic: different regions have different delivery times
    let additionalDays = 0;
    if (zipCode.startsWith('9')) additionalDays = 1; // West Coast
    if (zipCode.startsWith('0') || zipCode.startsWith('1')) additionalDays = 0; // East Coast
    
    const totalDays = baseDays + additionalDays;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + totalDays);
    
    return {
      address: `${address.address1}, ${address.city}, ${address.state} ${address.zipCode}`,
      estimatedDelivery: deliveryDate.toLocaleDateString(),
      shippingMethod: shipping.name,
      cost: shipping.price
    };
  };

  const handleShippingSelect = (shipping: ShippingOption) => {
    setSelectedShipping(shipping);
    if (selectedAddress) {
      const estimate = calculateDeliveryEstimate(selectedAddress, shipping);
      setDeliveryEstimate(estimate);
    }
  };

  const validateAddress = (address: Omit<Address, 'id'>) => {
    const errors: string[] = [];
    
    if (!address.firstName.trim()) errors.push('First name is required');
    if (!address.lastName.trim()) errors.push('Last name is required');
    if (!address.address1.trim()) errors.push('Address line 1 is required');
    if (!address.city.trim()) errors.push('City is required');
    if (!address.state.trim()) errors.push('State is required');
    if (!address.zipCode.trim()) errors.push('ZIP code is required');
    if (!address.phone.trim()) errors.push('Phone number is required');
    
    // ZIP code validation
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (address.zipCode && !zipRegex.test(address.zipCode)) {
      errors.push('Please enter a valid ZIP code');
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (address.phone && !phoneRegex.test(address.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Please enter a valid phone number');
    }
    
    return errors;
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shipping & Address Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your delivery addresses and shipping preferences</p>
            </div>
            <button
              onClick={() => setIsAddingAddress(true)}
              className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-300"
            >
              Add New Address
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Address Management */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Saved Addresses</h2>
              
              {addresses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-6">📍</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No addresses saved</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Add your first address to get started</p>
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-300"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map(address => (
                    <div 
                      key={address.id} 
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedAddress?.id === address.id 
                          ? 'border-gray-900 bg-gray-50 dark:bg-gray-900' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{address.type} Address</h3>
                        {address.isDefault && (
                          <span className="px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-gray-600 dark:text-gray-400">
                        <p className="font-medium">{address.firstName} {address.lastName}</p>
                        {address.company && <p>{address.company}</p>}
                        <p>{address.address1}</p>
                        {address.address2 && <p>{address.address2}</p>}
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>{address.country}</p>
                        <p>{address.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Address Form */}
            {isAddingAddress && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add New Address</h3>
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                      <select
                        value={newAddress.type}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
                      <input
                        type="text"
                        value={newAddress.company}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        value={newAddress.firstName}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        value={newAddress.lastName}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                    <input
                      type="text"
                      value={newAddress.address1}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, address1: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={newAddress.address2}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, address2: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                        required
                        pattern="[0-9]{5}(-[0-9]{4})?"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Set as default address</span>
                    </label>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-300"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 dark:bg-gray-900 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Shipping Options */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shipping Options</h2>
              
              <div className="space-y-4">
                {shippingOptions.map(option => (
                  <div 
                    key={option.id}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedShipping?.id === option.id 
                        ? 'border-gray-900 bg-gray-50 dark:bg-gray-900' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleShippingSelect(option)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl">{option.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{option.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{option.description}</p>
                          <p className="text-gray-500 text-sm">{option.estimatedDays}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {option.price === 0 ? 'Free' : `$${option.price}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Estimate */}
            {deliveryEstimate && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Delivery Estimate</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Delivery Address</h3>
                    <p className="text-gray-600 dark:text-gray-400">{deliveryEstimate.address}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Shipping Method</h3>
                    <p className="text-gray-600 dark:text-gray-400">{deliveryEstimate.shippingMethod}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Estimated Delivery</h3>
                    <p className="text-gray-600 dark:text-gray-400">{deliveryEstimate.estimatedDelivery}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Shipping Cost</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {deliveryEstimate.cost === 0 ? 'Free' : `$${deliveryEstimate.cost}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressManagement;
