import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      console.log('🔄 AuthContext: Updating user with:', Object.keys(userData));
      
      // Create updated user object
      const updatedUser = { ...user, ...userData };
      
      // Check if avatar is being updated
      if (userData.avatar) {
        console.log('🖼️ AuthContext: Avatar update detected');
        console.log('📏 Avatar length:', userData.avatar.length);
        console.log('🔗 Avatar starts with:', userData.avatar.substring(0, 50));
      }
      
      // Update state
      setUser(updatedUser);
      
      // Store in localStorage
      try {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('💾 AuthContext: User saved to localStorage');
        
        // Verify storage
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log('✅ AuthContext: Storage verified - avatar exists:', !!parsed.avatar);
        }
      } catch (error) {
        console.error('❌ AuthContext: Failed to save to localStorage:', error);
      }
      
      console.log('✅ AuthContext: User updated successfully');
    } else {
      console.log('❌ AuthContext: No user found to update');
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

