// src/context/CartContext.tsx
import React, { createContext, useState, ReactNode } from "react";
import { CartItem, Product } from "../types";

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateQuantity: (id: number, quantity: number) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    // Check if product is in stock
    if ((product.stock || 0) <= 0) {
      alert('This product is currently out of stock.');
      return;
    }

    setCart(prev => {
      const exist = prev.find(item => item.id === product.id);
      if (exist) {
        // Check if adding one more would exceed stock
        if (exist.quantity + 1 > (product.stock || 0)) {
          alert(`Only ${product.stock} items available in stock.`);
          return prev;
        }
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(prev => prev.map(item => {
      if (item.id === id) {
        // Check if new quantity exceeds stock
        if (quantity > (item.stock || 0)) {
          alert(`Only ${item.stock} items available in stock.`);
          return item;
        }
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
