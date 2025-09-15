export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  images?: string[];
  stock?: number;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  originalPrice?: number;
  discountPercentage?: number;
  isOnSale?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  variants?: {
    colors?: string[];
    sizes?: string[];
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful?: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  phone?: string;
  addresses?: Address[];
  wishlist?: number[];
  orderHistory?: Order[];
}

export interface Address {
  id: number;
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface WishlistItem {
  id: number;
  productId: number;
  addedDate: string;
}

export interface SearchResult {
  products: Product[];
  total: number;
  query: string;
  filters: {
    category?: string;
    priceRange?: string;
    rating?: number;
  };
}
