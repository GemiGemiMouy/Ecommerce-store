import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { Address, Order, Product } from "../types";
import { fetchUserAddresses, fetchUserOrders, addUserAddress, fetchProducts } from "../services/api";
import ImageUpload from "../components/ImageUpload";

const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'settings' | 'wishlist' | 'activity'>('profile');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [settings, setSettings] = useState({
    orderUpdates: true,
    promotionalEmails: false,
    twoFactorEnabled: false
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUpdatingProfilePicture, setIsUpdatingProfilePicture] = useState(false);
  const [avatarKey, setAvatarKey] = useState(0);
  const [forceRefresh, setForceRefresh] = useState(0);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showToolsDropdown) {
        const target = event.target as Element;
        if (!target.closest('.tools-dropdown')) {
          setShowToolsDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showToolsDropdown]);
  
  // Monitor user avatar changes
  useEffect(() => {
    console.log('User avatar changed:', user?.avatar ? 'Has avatar' : 'No avatar');
    if (user?.avatar) {
      console.log('Avatar URL length:', user.avatar.length);
    }
  }, [user?.avatar]);
  
  // Test avatar functionality
  const testAvatar = () => {
    console.log('🧪 === AVATAR DEBUG TEST ===');
    console.log('👤 User:', user?.firstName, user?.lastName);
    console.log('🆔 User ID:', user?.id);
    console.log('🖼️ Has Avatar:', !!user?.avatar);
    console.log('🖼️ Avatar Value:', user?.avatar);
    console.log('🖼️ Avatar Type:', typeof user?.avatar);
    console.log('🖼️ Avatar Length:', user?.avatar?.length);
    
    if (user?.avatar) {
      console.log('📏 Avatar Length:', user.avatar.length);
      console.log('🔗 Avatar Type:', user.avatar.substring(0, 50));
      console.log('🔗 Avatar Ends with:', user.avatar.substring(user.avatar.length - 20));
      console.log('💾 localStorage Check:', localStorage.getItem('user') ? 'Exists' : 'Missing');
      
      // Test if it's a valid data URL
      const isValidDataUrl = user.avatar.startsWith('data:');
      console.log('✅ Is Valid Data URL:', isValidDataUrl);
      
      if (isValidDataUrl) {
        const [header, data] = user.avatar.split(',');
        console.log('📋 Data URL Header:', header);
        console.log('📋 Data Length:', data?.length);
      }
    } else {
      console.log('❌ No avatar found');
    }
    
    // Force re-render
    setAvatarKey(prev => prev + 1);
    setForceRefresh(prev => prev + 1);
    console.log('🔄 UI refresh triggered');
    console.log('🧪 === END DEBUG TEST ===');
  };

  // Quick test with sample image
  const testWithSampleImage = () => {
    console.log('🎨 Testing with sample image...');
    const sampleImageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzAwN2JmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VDwvdGV4dD48L3N2Zz4=';
    
    updateUser({ avatar: sampleImageUrl });
    setAvatarKey(prev => prev + 1);
    setForceRefresh(prev => prev + 1);
    
    console.log('✅ Sample image applied');
    alert('Sample image applied for testing!');
  };

  const testWithSimpleImage = () => {
    console.log('🎨 Testing with simple PNG image...');
    // Create a simple 1x1 red pixel PNG
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw a red circle
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(50, 50, 40, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add text
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('A', 50, 55);
      
      const dataUrl = canvas.toDataURL('image/png');
      console.log('🖼️ Generated image data URL:', dataUrl.substring(0, 50) + '...');
      
      updateUser({ avatar: dataUrl });
      setAvatarKey(prev => prev + 1);
      setForceRefresh(prev => prev + 1);
      
      console.log('✅ Simple image applied');
      alert('Simple red circle image applied!');
    }
  };

  const clearAvatar = () => {
    console.log('🗑️ Clearing avatar...');
    updateUser({ avatar: '' });
    setAvatarKey(prev => prev + 1);
    setForceRefresh(prev => prev + 1);
    console.log('✅ Avatar cleared');
  };

  const exportProfileData = () => {
    if (!user) return;
    
    console.log('📤 Exporting profile data...');
    const profileData = {
      user: user,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(profileData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `profile-data-${user?.firstName || 'user'}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Profile data exported');
    alert('Profile data exported successfully!');
  };

  const testLocalStorage = () => {
    console.log('🧪 Testing localStorage...');
    try {
      const testData = { test: 'data', timestamp: Date.now() };
      localStorage.setItem('test', JSON.stringify(testData));
      const retrieved = localStorage.getItem('test');
      localStorage.removeItem('test');
      
      if (retrieved) {
        console.log('✅ localStorage is working');
        alert('✅ localStorage is working properly!');
      } else {
        console.log('❌ localStorage failed');
        alert('❌ localStorage test failed!');
      }
    } catch (error) {
      console.error('❌ localStorage error:', error);
      alert('❌ localStorage error: ' + error);
    }
  };

  const clearAllData = () => {
    if (window.confirm('⚠️ This will clear ALL profile data including avatar. Are you sure?')) {
      console.log('🗑️ Clearing all profile data...');
      updateUser({ 
        avatar: '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || ''
      });
      setAvatarKey(prev => prev + 1);
      setForceRefresh(prev => prev + 1);
      console.log('✅ All profile data cleared');
      alert('✅ All profile data cleared!');
    }
  };

  const refreshProfile = () => {
    console.log('🔄 Refreshing profile...');
    setAvatarKey(prev => prev + 1);
    setForceRefresh(prev => prev + 1);
    console.log('✅ Profile refreshed');
    alert('✅ Profile refreshed!');
  };

  const showSystemInfo = () => {
    const info = {
      userAgent: navigator.userAgent,
      localStorage: typeof(Storage) !== "undefined",
      canvas: !!document.createElement('canvas').getContext,
      fileReader: !!window.FileReader,
      timestamp: new Date().toISOString(),
      avatarLength: user?.avatar?.length || 0,
      hasAvatar: !!user?.avatar
    };
    
    console.log('ℹ️ System Info:', info);
    alert(`System Info:\n\nUser Agent: ${info.userAgent.substring(0, 50)}...\nLocalStorage: ${info.localStorage}\nCanvas: ${info.canvas}\nFileReader: ${info.fileReader}\nAvatar Length: ${info.avatarLength}\nHas Avatar: ${info.hasAvatar}`);
  };
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'Order placed', description: 'Order #12345 for $89.99', date: '2024-01-15', type: 'order' },
    { id: 2, action: 'Address added', description: 'New work address added', date: '2024-01-14', type: 'address' },
    { id: 3, action: 'Profile updated', description: 'Phone number updated', date: '2024-01-13', type: 'profile' },
    { id: 4, action: 'Item added to wishlist', description: 'Premium Cotton T-Shirt', date: '2024-01-12', type: 'wishlist' }
  ]);
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

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Load user data with error handling
    const loadUserData = async () => {
      try {
        console.log('Loading user data for user ID:', user.id);
        const [addressesData, ordersData] = await Promise.all([
          fetchUserAddresses(user.id),
          fetchUserOrders(user.id)
        ]);
        setAddresses(addressesData);
        setOrders(ordersData);
        console.log('User data loaded successfully');
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, [user, navigate]);

  // Load wishlist products
  useEffect(() => {
    const loadWishlistProducts = async () => {
      try {
      if (wishlist.length > 0) {
          console.log('Loading wishlist products...');
        const allProducts = await fetchProducts();
        const wishlistProductIds = wishlist.map(item => item.productId);
        const products = allProducts.filter(product => wishlistProductIds.includes(product.id));
        setWishlistProducts(products);
          console.log('Wishlist products loaded:', products.length);
      } else {
          setWishlistProducts([]);
        }
      } catch (error) {
        console.error('Error loading wishlist products:', error);
        setWishlistProducts([]);
      }
    };
    
    loadWishlistProducts();
  }, [wishlist]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user profile
    console.log('Profile updated:', profileData);
    setIsEditing(false);
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

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setNewAddress({
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || '',
      address1: address.address1,
      address2: address.address2 || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault || false
    });
    setIsAddingAddress(true);
  };

  const handleDeleteAddress = (addressId: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    }
  };

  const handleReorder = (order: Order) => {
    // In a real app, this would add all items from the order to cart
    console.log('Reordering:', order);
    navigate('/cart');
  };

  const handleCancelOrder = (orderId: number) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' as const }
          : order
      ));
    }
  };

  const handleSettingsChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    // In a real app, this would update the password
    console.log('Password changed successfully');
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleTwoFactorToggle = () => {
    setSettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
    if (!settings.twoFactorEnabled) {
      setShowTwoFactorModal(true);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, this would delete the account
      console.log('Account deletion requested');
      logout();
      navigate('/');
    }
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
  };

  const handleUpdateProfilePicture = async () => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }

    console.log('🚀 PROFILE IMAGE UPLOAD STARTED');
    console.log('📁 File:', selectedImage.name, selectedImage.size, 'bytes');
    console.log('📄 Type:', selectedImage.type);
    
    setIsUpdatingProfilePicture(true);

    // Step 1: Validate file
    if (!selectedImage.type.startsWith('image/')) {
      alert('Please select a valid image file');
      setIsUpdatingProfilePicture(false);
      return;
    }

    if (selectedImage.size > 10 * 1024 * 1024) { // 10MB limit
      alert('Image file is too large. Please select an image smaller than 10MB');
      setIsUpdatingProfilePicture(false);
      return;
    }

    try {
      console.log('📖 Reading file with FileReader...');
      
      // Step 2: Read file as base64
      const reader = new FileReader();
      
      const imageUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = (event) => {
          const result = event.target?.result;
          if (typeof result === 'string' && result.startsWith('data:image/')) {
            console.log('✅ FileReader success - Base64 length:', result.length);
            resolve(result);
          } else {
            console.error('❌ FileReader failed - Invalid result');
            reject(new Error('Failed to read image file'));
          }
        };
        
        reader.onerror = (event) => {
          console.error('❌ FileReader error:', event);
          reject(new Error('Error reading image file'));
        };
        
        reader.readAsDataURL(selectedImage);
      });

      console.log('🔄 Updating user context...');
      
      // Step 3: Update user context
      updateUser({ avatar: imageUrl });
      
      console.log('🎨 Forcing UI refresh...');
      
      // Step 4: Force UI refresh
      setAvatarKey(prev => prev + 1);
      setForceRefresh(prev => prev + 1);
      
      // Step 5: Clean up and close
      setTimeout(() => {
      setShowProfilePictureModal(false);
      setSelectedImage(null);
        setIsUpdatingProfilePicture(false);
      
        console.log('🎉 PROFILE IMAGE UPLOAD COMPLETED SUCCESSFULLY');
        alert('✅ Profile picture updated successfully!');
      }, 100);
      
    } catch (error) {
      console.error('💥 PROFILE IMAGE UPLOAD FAILED:', error);
      setIsUpdatingProfilePicture(false);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`❌ Failed to update profile picture: ${errorMessage}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-gray-600 dark:text-gray-400 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100';
    }
  };

  if (!user) {
    console.log('Profile: No user found, redirecting to login');
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-700 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('Profile: Rendering profile for user:', user);
  console.log('Profile: User avatar status:', user?.avatar ? 'Has avatar' : 'No avatar');
  if (user?.avatar) {
    console.log('Profile: Avatar URL length:', user.avatar.length);
    console.log('Profile: Avatar starts with:', user.avatar.substring(0, 50));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/90"></div>
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Profile Avatar */}
              <div className="relative group">
                <button
                  onClick={() => setShowProfilePictureModal(true)}
                  className="relative w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/20 shadow-2xl hover:border-white/40 transition-all duration-300 group-hover:scale-105 overflow-hidden"
                >
                  {user.avatar && user.avatar.trim() !== '' ? (
                    <img
                      key={`${avatarKey}-${forceRefresh}`}
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                      onLoad={() => console.log('✅ Avatar image loaded successfully')}
                      onError={(e) => {
                        console.error('❌ Avatar image failed to load:', e);
                        console.log('🔄 Falling back to initials display');
                        // Force fallback to initials
                        setAvatarKey(prev => prev + 1);
                      }}
                      style={{ display: 'block' }}
                    />
                  ) : (
                    <span className="text-3xl lg:text-4xl font-bold text-white">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </button>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 dark:border-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white">
                  Welcome back, {user.firstName}!
                </h1>
                  
                  {/* Modern Tools Dropdown */}
                  <div className="relative tools-dropdown">
                    <button
                      onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                      className="group flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105"
                    >
                      <svg className="w-4 h-4 text-white group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-white text-sm font-medium">Tools</span>
                      <svg className={`w-4 h-4 text-white transition-transform duration-200 ${showToolsDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Enhanced Dropdown Menu */}
                    {showToolsDropdown && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
                          onClick={() => setShowToolsDropdown(false)}
                        />
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 max-h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg z-[9999] animate-in slide-in-from-top-2 duration-200 overflow-y-auto"
                             style={{
                               minWidth: '320px',
                               maxWidth: '320px'
                             }}>
                        <div className="p-3">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Profile Tools</h3>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Active</span>
                              </div>
                              <button
                                onClick={() => setShowToolsDropdown(false)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Avatar Tools Grid */}
                          <div className="mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Avatar Tools</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => {
                                  testWithSampleImage();
                                  setShowToolsDropdown(false);
                                }}
                                className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-200 group"
                              >
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">Sample Image</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Blue Circle</p>
                              </button>
                              
                              <button
                                onClick={() => {
                                  testWithSimpleImage();
                                  setShowToolsDropdown(false);
                                }}
                                className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-all duration-200 group"
                              >
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                  </svg>
                                </div>
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">PNG Image</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Red Circle</p>
                              </button>
                              
                              <button
                                onClick={() => {
                                  testAvatar();
                                  setShowToolsDropdown(false);
                                }}
                                className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-all duration-200 group"
                              >
                                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                </div>
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">Debug</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Check State</p>
                              </button>
                              
                              <button
                                onClick={() => {
                                  clearAvatar();
                                  setShowToolsDropdown(false);
                                }}
                                className="flex flex-col items-center p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200 group"
                              >
                                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                  <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </div>
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">Clear</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Remove Avatar</p>
                              </button>
                            </div>
                          </div>

                          {/* System Tools */}
                          <div className="mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">System Tools</p>
                            </div>
                            
                            <div className="space-y-1">
                              <button
                                onClick={() => {
                                  refreshProfile();
                                  setShowToolsDropdown(false);
                                }}
                                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 group"
                              >
                                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <svg className="w-3 h-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                </div>
                                <span className="text-sm font-medium">Refresh Profile</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  testLocalStorage();
                                  setShowToolsDropdown(false);
                                }}
                                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 group"
                              >
                                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <svg className="w-3 h-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                  </svg>
                                </div>
                                <span className="text-sm font-medium">Test LocalStorage</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  showSystemInfo();
                                  setShowToolsDropdown(false);
                                }}
                                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 group"
                              >
                                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <svg className="w-3 h-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <span className="text-sm font-medium">System Info</span>
                              </button>
                            </div>
                          </div>

                          {/* Data Management */}
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                              </svg>
                              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Data Management</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => {
                                  exportProfileData();
                                  setShowToolsDropdown(false);
                                }}
                                className="flex items-center justify-center space-x-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-all duration-200 group"
                              >
                                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Export</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  clearAllData();
                                  setShowToolsDropdown(false);
                                }}
                                className="flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 group"
                              >
                                <svg className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span className="text-sm font-medium text-red-700 dark:text-red-300">Clear All</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-xl mb-4 text-white">{user.email}</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-white">Verified Account</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-white">Member since 2024</span>
                  </div>
                </div>
              </div>
              
              {/* Logout Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={handleLogout}
                  className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-white">Sign Out</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Tab Navigation */}
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-8 py-4">
            <nav className="flex space-x-2">
              {[
                { 
                  id: 'profile', 
                  label: 'Profile', 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )
                },
                { 
                  id: 'orders', 
                  label: 'Orders', 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )
                },
                { 
                  id: 'addresses', 
                  label: 'Addresses', 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                },
                { 
                  id: 'wishlist', 
                  label: 'Wishlist', 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )
                },
                { 
                  id: 'activity', 
                  label: 'Activity', 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  )
                },
                { 
                  id: 'settings', 
                  label: 'Settings', 
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group relative px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center space-x-3 ${
                    activeTab === tab.id
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-white dark:bg-gray-800/50'
                  }`}
                >
                  <div className={`transition-colors duration-300 ${
                    activeTab === tab.id ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:text-gray-300'
                  }`}>
                    {tab.icon}
                  </div>
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl -z-10"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8 lg:p-12">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Personal Information</h2>
                    <p className="text-gray-600 dark:text-gray-400">Manage your account details and preferences</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`group px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                      isEditing 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-gray-900 text-white hover:bg-gray-700'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Cancel</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit Profile</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Details */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-3xl p-8 border border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Basic Information</h3>
                    </div>
                    
                    <form id="profile-form" onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">First Name</label>
                          <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Last Name</label>
                          <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 transition-all duration-300"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Email Address</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 transition-all duration-300"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 (555) 123-4567"
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 transition-all duration-300"
                        />
                      </div>
                    </form>
                  </div>

                  {/* Account Stats */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-3xl p-8 border border-blue-200/50 dark:border-blue-700/50">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account Statistics</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{orders.length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{addresses.length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Saved Addresses</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-3xl p-8 border border-green-200/50 dark:border-green-700/50">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account Status</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Email Verified</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-green-600 font-semibold">Verified</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Account Status</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-green-600 font-semibold">Active</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Member Since</span>
                          <span className="text-gray-900 dark:text-white font-semibold">January 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button 
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          firstName: user?.firstName || '',
                          lastName: user?.lastName || '',
                          email: user?.email || '',
                          phone: user?.phone || ''
                        });
                      }}
                      className="px-8 py-3 border-2 border-gray-300 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-50 dark:bg-gray-700 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      form="profile-form"
                      className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-700 transition-all duration-300"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order History</h2>
                    <p className="text-gray-600 dark:text-gray-400">Track your orders and view order details</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl px-4 py-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{orders.length} Orders</span>
                    </div>
                  </div>
                </div>
                
                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No orders yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Start shopping to see your orders here. Discover amazing products and build your order history!</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="group px-8 py-4 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-700 transition-all duration-300 flex items-center space-x-3 mx-auto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span>Start Shopping</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/50 p-8 hover:shadow-xl transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                          <div className="mb-4 lg:mb-0">
                            <div className="flex items-center space-x-4 mb-2">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order #{order.orderNumber}</h3>
                              <span className={`px-3 py-1 rounded-2xl text-sm font-semibold ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">Placed on {new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">${order.total.toFixed(2)}</p>
                            {order.trackingNumber && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tracking: {order.trackingNumber}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                              <svg className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                              Items ({order.items.length})
                            </h4>
                            <div className="space-y-4">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-16 h-16 object-cover rounded-xl"
                                  />
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">${(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                              <svg className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Shipping Address
                            </h4>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                              <p className="text-gray-900 dark:text-white font-semibold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                              <p className="text-gray-700 dark:text-gray-300">{order.shippingAddress.address1}</p>
                              {order.shippingAddress.address2 && <p className="text-gray-700 dark:text-gray-300">{order.shippingAddress.address2}</p>}
                              <p className="text-gray-700 dark:text-gray-300">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                              <p className="text-gray-700 dark:text-gray-300">{order.shippingAddress.country}</p>
                              <p className="text-gray-700 dark:text-gray-300">{order.shippingAddress.phone}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                          <button 
                            onClick={() => handleReorder(order)}
                            className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-all duration-300"
                          >
                            Reorder
                          </button>
                          {order.status === 'pending' && (
                            <button 
                              onClick={() => handleCancelOrder(order.id)}
                              className="px-4 py-2 border-2 border-red-300 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-all duration-300"
                            >
                              Cancel Order
                            </button>
                          )}
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="px-4 py-2 border-2 border-gray-300 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:bg-gray-700 transition-all duration-300"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Saved Addresses</h2>
                    <p className="text-gray-600 dark:text-gray-400">Manage your shipping addresses for faster checkout</p>
                  </div>
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="group px-6 py-3 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-700 transition-all duration-300 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Address</span>
                  </button>
                </div>

                {isAddingAddress && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200/50">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Address</h3>
                      <button
                        onClick={() => setIsAddingAddress(false)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <form onSubmit={handleAddAddress} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Address Type</label>
                          <select
                            value={newAddress.type}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value as any }))}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Company (Optional)</label>
                          <input
                            type="text"
                            value={newAddress.company}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, company: e.target.value }))}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">First Name</label>
                          <input
                            type="text"
                            value={newAddress.firstName}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, firstName: e.target.value }))}
                            required
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Last Name</label>
                          <input
                            type="text"
                            value={newAddress.lastName}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, lastName: e.target.value }))}
                            required
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Address Line 1</label>
                        <input
                          type="text"
                          value={newAddress.address1}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, address1: e.target.value }))}
                          required
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Address Line 2 (Optional)</label>
                        <input
                          type="text"
                          value={newAddress.address2}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, address2: e.target.value }))}
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">City</label>
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                            required
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">State</label>
                          <input
                            type="text"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                            required
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">ZIP Code</label>
                          <input
                            type="text"
                            value={newAddress.zipCode}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                            required
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Phone</label>
                        <input
                          type="tel"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                          required
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newAddress.isDefault}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                            className="mr-3 w-5 h-5 text-gray-900 dark:text-white border-2 border-gray-300 rounded focus:ring-gray-900"
                          />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Set as default address</span>
                        </label>
                      </div>
                      
                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => setIsAddingAddress(false)}
                          className="px-8 py-3 border-2 border-gray-300 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-50 dark:bg-gray-700 transition-all duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-700 transition-all duration-300"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {addresses.map(address => (
                    <div key={address.id} className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/50 p-8 hover:shadow-xl transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{address.type} Address</h3>
                        </div>
                        {address.isDefault && (
                          <span className="px-3 py-1 bg-gray-900 text-white text-sm font-semibold rounded-2xl">
                            Default
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-3 text-gray-700 dark:text-gray-300 mb-6">
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">{address.firstName} {address.lastName}</p>
                        {address.company && <p className="text-gray-600 dark:text-gray-400">{address.company}</p>}
                        <p>{address.address1}</p>
                        {address.address2 && <p>{address.address2}</p>}
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>{address.country}</p>
                        <p className="text-gray-600 dark:text-gray-400">{address.phone}</p>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleEditAddress(address)}
                          className="flex-1 px-4 py-3 bg-gray-900 text-white text-sm font-semibold rounded-2xl hover:bg-gray-700 transition-all duration-300"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteAddress(address.id)}
                          className="flex-1 px-4 py-3 border-2 border-red-300 text-red-600 text-sm font-semibold rounded-2xl hover:bg-red-50 transition-all duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Wishlist</h2>
                    <p className="text-gray-600 dark:text-gray-400">Your saved items and favorites</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl px-4 py-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{wishlistProducts.length} Items</span>
                    </div>
                  </div>
                </div>
                
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your wishlist is empty</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Start adding items you love to your wishlist. They'll appear here for easy access!</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="group px-8 py-4 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-700 transition-all duration-300 flex items-center space-x-3 mx-auto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span>Start Shopping</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistProducts.map(item => (
                      <div key={item.id} className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500">
                        <div className="relative mb-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover rounded-2xl"
                          />
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-100 transition-all duration-300"
                          >
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2">{item.title}</h3>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor((item.rating || 0)) ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">({item.reviewCount || 0})</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-gray-900 dark:text-white">${item.price.toFixed(2)}</span>
                              {item.isOnSale && item.originalPrice && (
                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                              )}
                            </div>
                            {item.isOnSale && (
                              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-lg">
                                -{item.discountPercentage}%
                              </span>
                            )}
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/product/${item.id}`)}
                              className="flex-1 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-all duration-300"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => navigate('/cart')}
                              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:bg-gray-700 transition-all duration-300"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Recent Activity</h2>
                    <p className="text-gray-600 dark:text-gray-400">Track your recent account activity and actions</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl px-4 py-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{recentActivity.length} Activities</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          activity.type === 'order' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          activity.type === 'address' ? 'bg-green-100 dark:bg-green-900/30' :
                          activity.type === 'profile' ? 'bg-purple-100 dark:bg-purple-900/30' :
                          'bg-pink-100 dark:bg-pink-900/30'
                        }`}>
                          {activity.type === 'order' && (
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          )}
                          {activity.type === 'address' && (
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                          {activity.type === 'profile' && (
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                          {activity.type === 'wishlist' && (
                            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-900 dark:text-white">{activity.action}</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(activity.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">{activity.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Activity Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-3xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Orders</h3>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{orders.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total orders placed</div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-3xl p-6 border border-green-200/50 dark:border-green-700/50">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Wishlist</h3>
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{wishlistProducts.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Items saved</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-3xl p-6 border border-purple-200/50 dark:border-purple-700/50">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Addresses</h3>
                    </div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">{addresses.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Saved addresses</div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Account Settings</h2>
                  <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and security settings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Security Settings */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-3xl p-8 border border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Security</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <button 
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Change Password</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Update your account password</p>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                      
                      <button 
                        onClick={handleTwoFactorToggle}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-semibold ${settings.twoFactorEnabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                              {settings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-3xl p-8 border border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L16 4l-6.586-6.586a2 2 0 00-2.828 0L4.828 1H2a1 1 0 00-1 1v4a1 1 0 001 1h2.828z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Order Updates</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about order status changes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.orderUpdates}
                            onChange={(e) => handleSettingsChange('orderUpdates', e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 after:border-gray-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900 dark:peer-checked:bg-gray-700"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Promotional Emails</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Receive special offers and discounts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.promotionalEmails}
                            onChange={(e) => handleSettingsChange('promotionalEmails', e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-300 after:border-gray-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900 dark:peer-checked:bg-gray-700"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-3xl p-8 border border-red-200/50 dark:border-red-700/50">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Danger Zone</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={handleDeleteAccount}
                      className="px-6 py-3 border-2 border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 font-semibold rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                    >
                      Delete Account
                    </button>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone. All your data will be permanently deleted.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Order Details</h2>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Order Number:</span>
                        <span className="font-semibold">#{selectedOrder.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
                        <span className="font-semibold">{new Date(selectedOrder.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={`px-3 py-1 rounded-2xl text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total:</span>
                        <span className="font-semibold text-lg">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Tracking:</span>
                          <span className="font-semibold">{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Items ({selectedOrder.items.length})</h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-xl"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Change Password</h2>
                <button 
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-50 dark:bg-gray-700 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-700 transition-all duration-300"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Two-Factor Authentication Modal */}
        {showTwoFactorModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enable Two-Factor Authentication</h2>
                <button 
                  onClick={() => setShowTwoFactorModal(false)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Scan QR Code</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Use your authenticator app to scan this QR code</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Secret Key:</p>
                  <p className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border">ABCD EFGH IJKL MNOP QRST UVWX YZ12 3456</p>
                </div>
                
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    onClick={() => setShowTwoFactorModal(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-50 dark:bg-gray-700 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setSettings(prev => ({ ...prev, twoFactorEnabled: true }));
                      setShowTwoFactorModal(false);
                    }}
                    className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-700 transition-all duration-300"
                  >
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modern Profile Picture Upload Modal */}
        {showProfilePictureModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-in slide-in-from-bottom-4 duration-500">
              {/* Header */}
              <div className="relative p-8 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Update Profile Picture</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Choose a new avatar for your profile</p>
                  </div>
                <button 
                  onClick={() => {
                    setShowProfilePictureModal(false);
                    setSelectedImage(null);
                  }}
                    className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 group"
                >
                    <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="px-8 pb-8">
              <div className="space-y-6">
                  {/* Current Profile Preview */}
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-600 shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                        {user.avatar && user.avatar.trim() !== '' ? (
                          <img
                            src={user.avatar}
                            alt="Current profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Current Profile Picture</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Upload a new image or keep your current avatar</p>
                  </div>

                  {/* Modern Upload Area */}
                  <div className="relative">
                    <div
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="group relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                    >
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageSelect(file);
                          }
                        }}
                        className="hidden"
                      />
                      
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="p-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Test Options */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Test Options</p>
                    <div className="flex space-x-3">
                      <button
                        onClick={testAvatar}
                        className="flex-1 px-4 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 group"
                      >
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span>Debug</span>
                      </button>
                      <button
                        onClick={testWithSampleImage}
                        className="flex-1 px-4 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center justify-center space-x-2 group"
                      >
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Test Image</span>
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => {
                      setShowProfilePictureModal(false);
                      setSelectedImage(null);
                    }}
                      className="flex-1 px-6 py-3.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfilePicture}
                      disabled={!selectedImage || isUpdatingProfilePicture}
                      className="flex-1 px-6 py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-2xl hover:from-gray-800 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      {isUpdatingProfilePicture ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Update Picture</span>
                        </>
                      )}
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
