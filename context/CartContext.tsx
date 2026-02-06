
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Listing } from '../types';

export interface CartItem {
  listing: Listing;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  storeId: string | null; // ID of the store currently in cart
  storeName: string | null;
  addToCart: (listing: Listing) => 'success' | 'conflict_store' | 'error';
  removeFromCart: (listingId: string) => void;
  updateQuantity: (listingId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);

  // Persistence (Optional for MVP but good for UX)
  useEffect(() => {
    const savedCart = localStorage.getItem('wk_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed.items || []);
        setStoreId(parsed.storeId || null);
        setStoreName(parsed.storeName || null);
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wk_cart', JSON.stringify({ items, storeId, storeName }));
  }, [items, storeId, storeName]);

  const addToCart = (listing: Listing): 'success' | 'conflict_store' | 'error' => {
    // 1. Check constraints
    if (listing.subCategory === 'import_auto') return 'error'; // Should be blocked at UI level anyway
    if (listing.seller.type !== 'pro') return 'error';

    // 2. Check Store Conflict
    if (storeId && storeId !== listing.seller.id) {
      return 'conflict_store';
    }

    // 3. Add Item
    setItems(prev => {
      const existing = prev.find(i => i.listing.id === listing.id);
      if (existing) {
        return prev.map(i => i.listing.id === listing.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { listing, quantity: 1 }];
    });

    // 4. Set Store Context if empty
    if (!storeId) {
      setStoreId(listing.seller.id);
      setStoreName(listing.seller.name);
    }

    return 'success';
  };

  const removeFromCart = (listingId: string) => {
    setItems(prev => {
      const newItems = prev.filter(i => i.listing.id !== listingId);
      if (newItems.length === 0) {
        setStoreId(null); // Reset store context if empty
        setStoreName(null);
      }
      return newItems;
    });
  };

  const updateQuantity = (listingId: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.listing.id === listingId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
    setStoreId(null);
    setStoreName(null);
  };

  const cartTotal = items.reduce((sum, item) => sum + (item.listing.price * item.quantity), 0);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      storeId, 
      storeName,
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart, 
      cartTotal, 
      cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
