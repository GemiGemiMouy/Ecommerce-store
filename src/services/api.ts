// src/services/api.ts
import { Product, Review, Address, Order } from "../types";

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: 1,
    userId: 1,
    userName: "Sarah Johnson",
    userAvatar: "https://i.pinimg.com/736x/df/3e/21/df3e21ba0c6cfa17b52e92bbaec4c8c4.jpg",
    rating: 5,
    comment: "Absolutely love this t-shirt! The quality is amazing and it fits perfectly. Will definitely order again.",
    date: "2024-01-15",
    helpful: 12
  },
  {
    id: 2,
    userId: 2,
    userName: "Mike Chen",
    userAvatar: "https://i.pinimg.com/736x/b1/55/23/b1552389063eb9aa278695c1255fdd90.jpg",
    rating: 4,
    comment: "Great quality and comfortable. The only minor issue is the sizing runs a bit small.",
    date: "2024-01-10",
    helpful: 8
  },
  {
    id: 3,
    userId: 3,
    userName: "Emily Davis",
    userAvatar: "https://i.pinimg.com/1200x/3a/7f/da/3a7fda670ef616896449dc6e937381fb.jpg",
    rating: 5,
    comment: "Perfect! Exactly what I was looking for. Fast shipping and excellent customer service.",
    date: "2024-01-08",
    helpful: 15
  }
];

const mockProducts: Product[] = [
  { 
    id: 1, 
    title: "Premium Cotton T-Shirt", 
    price: 29.99, 
    description: "Ultra-soft premium cotton blend t-shirt with modern fit and sustainable materials", 
    image: "https://i.pinimg.com/1200x/79/67/38/79673890e28b20950d252d0310d3f7ae.jpg", 
    category: "Clothing",
    stock: 25,
    rating: 4.8,
    reviewCount: 127,
    reviews: mockReviews,
    originalPrice: 35.99,
    discountPercentage: 17,
    isOnSale: true,
    isNew: false,
    isBestSeller: true,
    variants: {
      colors: ["#000000", "#FFFFFF", "#808080", "#FF0000"],
      sizes: ["XS", "S", "M", "L", "XL"]
    },
    images: [
      "https://i.pinimg.com/1200x/79/67/38/79673890e28b20950d252d0310d3f7ae.jpg",
      "https://i.pinimg.com/1200x/de/5f/e4/de5fe406da41f798af0b292dbe82c28f.jpg",
      "https://i.pinimg.com/736x/9d/ca/d7/9dcad7094d4333d2872a1d2a21c2f58e.jpg",
      "https://i.pinimg.com/1200x/f6/22/09/f62209ee826376417633222e989743c6.jpg"
    ]
  },
  { 
    id: 2, 
    title: "Minimalist Sneakers", 
    price: 89.99, 
    description: "Clean, comfortable sneakers with premium leather and modern minimalist design", 
    image: "https://i.pinimg.com/1200x/5c/c6/d9/5cc6d949b49dc837689569ebb74a5305.jpg", 
    category: "Footwear",
    stock: 12,
    rating: 4.6,
    reviewCount: 89,
    reviews: mockReviews.slice(0, 2),
    originalPrice: 107.99,
    discountPercentage: 17,
    isOnSale: true,
    isNew: true,
    isBestSeller: false,
    variants: {
      colors: ["#000000", "#FFFFFF", "#8B4513"],
      sizes: ["7", "8", "9", "10", "11", "12"]
    },
    images: [
      "https://i.pinimg.com/1200x/5c/c6/d9/5cc6d949b49dc837689569ebb74a5305.jpg",
      "https://i.pinimg.com/736x/b3/1b/2f/b31b2f211f73fb8d8a25c30065f8470b.jpg",
      "https://i.pinimg.com/1200x/b2/3c/e8/b23ce8ade135a59b771cd893ee6e1c76.jpg",
      "https://i.pinimg.com/1200x/1f/b0/45/1fb045fb78e29998584f86865057134e.jpg"
    ]
  },
  { 
    id: 3, 
    title: "Urban Backpack", 
    price: 79.99, 
    description: "Sleek urban backpack with laptop compartment and modern tech-friendly design", 
    image: "https://i.pinimg.com/736x/d8/be/a3/d8bea3d421d45808ca21cd81821d5b31.jpg", 
    category: "Accessories",
    stock: 8,
    rating: 4.9,
    reviewCount: 156,
    reviews: mockReviews,
    originalPrice: 95.99,
    discountPercentage: 17,
    isOnSale: true,
    isNew: false,
    isBestSeller: true,
    variants: {
      colors: ["#000000", "#808080", "#4169E1"],
      sizes: ["One Size"]
    },
    images: [
      "https://i.pinimg.com/736x/d8/be/a3/d8bea3d421d45808ca21cd81821d5b31.jpg",
      "https://i.pinimg.com/1200x/f4/8f/9b/f48f9bd6130ef93acc087477e98dfe26.jpg",
      "https://i.pinimg.com/736x/6c/53/e2/6c53e2acf3a47a043e647c6fb4b2b5f6.jpg",
      "https://i.pinimg.com/736x/06/70/1b/06701bd190c0321147b09910ecfde06e.jpg"
    ]
  },
  { 
    id: 4, 
    title: "Designer Cap", 
    price: 39.99, 
    description: "Premium baseball cap with embroidered logo and adjustable fit", 
    image: "https://i.pinimg.com/1200x/c5/aa/b5/c5aab5453954ebacc15cfc1469cdf788.jpg", 
    category: "Accessories",
    stock: 0,
    rating: 4.7,
    reviewCount: 73,
    reviews: mockReviews.slice(1),
    originalPrice: 47.99,
    discountPercentage: 17,
    isOnSale: true,
    isNew: true,
    isBestSeller: false,
    variants: {
      colors: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
      sizes: ["One Size"]
    },
    images: [
      "https://i.pinimg.com/1200x/c5/aa/b5/c5aab5453954ebacc15cfc1469cdf788.jpg",
      "https://i.pinimg.com/736x/2e/31/1f/2e311f73dd881e64c6d0f22d9d91a017.jpg",
      "https://i.pinimg.com/1200x/9f/85/8a/9f858a400967b8ff86005a38737fa287.jpg",
      "https://i.pinimg.com/1200x/ad/37/60/ad376049b1560028ed2c0f9110753b9f.jpg"
    ]
  },
  { 
    id: 5, 
    title: "Smart Watch", 
    price: 199.99, 
    description: "Advanced smartwatch with health tracking, GPS, and premium stainless steel design", 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center", 
    category: "Electronics",
    stock: 5,
    rating: 4.5,
    reviewCount: 234,
    reviews: mockReviews,
    originalPrice: 239.99,
    discountPercentage: 17,
    isOnSale: true,
    isNew: false,
    isBestSeller: true,
    variants: {
      colors: ["#C0C0C0", "#000000", "#FFD700"],
      sizes: ["38mm", "42mm"]
    },
    images: [
      "https://i.pinimg.com/736x/44/42/18/44421813d3347e52b70397fa6c05c58d.jpg",
      "https://i.pinimg.com/736x/5a/b1/e9/5ab1e944b17f5b8f9a566afa1ff8433d.jpg",
      "https://i.pinimg.com/736x/5b/db/58/5bdb581f6e291c44c71afb8d68c46736.jpg",
      "https://i.pinimg.com/736x/7a/c1/5e/7ac15eaee8e3a792b9d69968f67fe6da.jpg"
    ]
  },
  { 
    id: 6, 
    title: "Wireless Headphones", 
    price: 149.99, 
    description: "Premium noise-cancelling wireless headphones with superior sound quality", 
    image: "https://i.pinimg.com/736x/d1/95/46/d195469f7500db289a33e886c513b72f.jpg", 
    category: "Electronics",
    stock: 15,
    rating: 4.8,
    reviewCount: 198,
    reviews: mockReviews.slice(0, 2),
    originalPrice: 179.99,
    discountPercentage: 17,
    isOnSale: true,
    isNew: true,
    isBestSeller: false,
    variants: {
      colors: ["#000000", "#FFFFFF", "#808080"],
      sizes: ["One Size"]
    },
    images: [
      "https://i.pinimg.com/736x/d1/95/46/d195469f7500db289a33e886c513b72f.jpg",
      "https://i.pinimg.com/736x/0d/c6/45/0dc645ca0ce98c5ad8bf43f13ccc9546.jpg",
      "https://i.pinimg.com/736x/af/f2/64/aff2641b403e1e474a5ecc0858ca0ea7.jpg",
      "https://i.pinimg.com/736x/4b/6c/aa/4b6caa79536a09fd97f551e59c1c2cdd.jpg"
    ]
  },
  { 
    id: 7, 
    title: "Leather Wallet", 
    price: 59.99, 
    description: "Handcrafted genuine leather wallet with RFID blocking technology", 
    image: "https://i.pinimg.com/1200x/05/35/b3/0535b381755d7776635a8206717b0232.jpg", 
    category: "Accessories",
    stock: 20,
    rating: 4.6,
    reviewCount: 67,
    reviews: mockReviews.slice(1),
    originalPrice: 71.99,
    discountPercentage: 17,
    isOnSale: true,
    isNew: false,
    isBestSeller: false,
    variants: {
      colors: ["#8B4513", "#000000", "#654321"],
      sizes: ["One Size"]
    },
    images: [
      "https://i.pinimg.com/1200x/05/35/b3/0535b381755d7776635a8206717b0232.jpg",
      "https://i.pinimg.com/1200x/ef/c6/ee/efc6ee21ce2f11ee607c646d4b5a1956.jpg",
      "https://i.pinimg.com/736x/2e/53/96/2e53965b1cb21f476a320026437dd812.jpg",
      "https://i.pinimg.com/1200x/ef/ba/0d/efba0d7b36bf4eab996a3bb94eb68a20.jpg"
    ]
  },
  { 
    id: 8, 
    title: "Denim Jacket", 
    price: 119.99, 
    description: "Classic denim jacket with modern fit and sustainable denim materials", 
    image: "https://i.pinimg.com/1200x/60/6a/0f/606a0f7bcf78b8cca9fb4961cc205f1e.jpg", 
    category: "Clothing",
    stock: 3,
    rating: 4.7,
    reviewCount: 145,
    reviews: mockReviews,
    originalPrice: 143.99,
    discountPercentage: 17,
    isOnSale: true,
    isNew: false,
    isBestSeller: false,
    variants: {
      colors: ["#4169E1", "#000000", "#FFFFFF"],
      sizes: ["S", "M", "L", "XL"]
    },
    images: [
      "https://i.pinimg.com/1200x/60/6a/0f/606a0f7bcf78b8cca9fb4961cc205f1e.jpg",
      "https://i.pinimg.com/736x/e0/c0/73/e0c07373164efff218bb534d0d6cec2c.jpg",
      "https://i.pinimg.com/736x/c1/2e/04/c12e042ec4c0f34d36aa9b4096d75865.jpg",
      "https://i.pinimg.com/736x/33/9f/8f/339f8f7e3f8c0fe810b055941a623e5e.jpg"
    ]
  }
];

// Mock addresses
const mockAddresses: Address[] = [
  {
    id: 1,
    type: 'home',
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Main Street',
    address2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    phone: '+1 (555) 123-4567',
    isDefault: true
  },
  {
    id: 2,
    type: 'work',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Tech Corp',
    address1: '456 Business Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10002',
    country: 'United States',
    phone: '+1 (555) 987-6543',
    isDefault: false
  }
];

// Mock orders
const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'GS-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    items: [
      { ...mockProducts[0], quantity: 2 },
      { ...mockProducts[1], quantity: 1 }
    ],
    total: 149.97,
    shippingAddress: mockAddresses[0],
    billingAddress: mockAddresses[0],
    paymentMethod: 'Credit Card ending in 1234',
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-18'
  },
  {
    id: 2,
    orderNumber: 'GS-2024-002',
    date: '2024-01-10',
    status: 'shipped',
    items: [
      { ...mockProducts[2], quantity: 1 }
    ],
    total: 79.99,
    shippingAddress: mockAddresses[1],
    billingAddress: mockAddresses[1],
    paymentMethod: 'PayPal',
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2024-01-13'
  }
];

export const fetchProducts = async (): Promise<Product[]> => {
  return mockProducts;
};

export const fetchProductById = async (id: number): Promise<Product | undefined> => {
  return mockProducts.find(p => p.id === id);
};

export const fetchProductReviews = async (productId: number): Promise<Review[]> => {
  const product = mockProducts.find(p => p.id === productId);
  return product?.reviews || [];
};

export const addProductReview = async (productId: number, review: Omit<Review, 'id' | 'date'>): Promise<Review> => {
  const newReview: Review = {
    ...review,
    id: Date.now(),
    date: new Date().toISOString().split('T')[0]
  };
  
  // In a real app, this would be sent to the backend
  const product = mockProducts.find(p => p.id === productId);
  if (product) {
    product.reviews = [...(product.reviews || []), newReview];
    product.reviewCount = (product.reviewCount || 0) + 1;
  }
  
  return newReview;
};

export const fetchUserAddresses = async (userId: number): Promise<Address[]> => {
  return mockAddresses;
};

export const addUserAddress = async (userId: number, address: Omit<Address, 'id'>): Promise<Address> => {
  const newAddress: Address = {
    ...address,
    id: Date.now()
  };
  mockAddresses.push(newAddress);
  return newAddress;
};

export const fetchUserOrders = async (userId: number): Promise<Order[]> => {
  return mockOrders;
};

export const fetchOrderById = async (orderId: number): Promise<Order | undefined> => {
  return mockOrders.find(o => o.id === orderId);
};

export const updateProductStock = async (productId: number, quantity: number): Promise<boolean> => {
  const product = mockProducts.find(p => p.id === productId);
  if (product && product.stock !== undefined) {
    product.stock = Math.max(0, product.stock - quantity);
    return true;
  }
  return false;
};
