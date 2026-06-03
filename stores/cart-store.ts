import { create } from 'zustand';
import { storage } from '../utils/storage';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  isLoading: boolean;

  loadCart: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CART_STORAGE_KEY = 'cart_items';

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  loadCart: async () => {
    set({ isLoading: true });
    try {
      const cartData = await storage.getItem(CART_STORAGE_KEY);
      const items = cartData ? JSON.parse(cartData) : [];
      set({ items, isLoading: false });
    } catch (error) {
      console.error('Load cart error:', error);
      set({ isLoading: false });
    }
  },

  addItem: async (item: Omit<CartItem, 'id'>) => {
    const { items } = get();
    const existingItemIndex = items.findIndex(
      (i) => 
        i.goodsId === item.goodsId && 
        i.temperature === item.temperature && 
        i.sweetness === item.sweetness &&
        i.size === item.size
    );

    let newItems: CartItem[];

    if (existingItemIndex >= 0) {
      newItems = items.map((i, index) => 
        index === existingItemIndex 
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      const newItem: CartItem = {
        ...item,
        id: `${item.goodsId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      newItems = [...items, newItem];
    }

    set({ items: newItems });
    await storage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
  },

  removeItem: async (itemId: string) => {
    const { items } = get();
    const newItems = items.filter((i) => i.id !== itemId);
    set({ items: newItems });
    await storage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const { items } = get();
    
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    const newItems = items.map((i) => 
      i.id === itemId ? { ...i, quantity } : i
    );
    
    set({ items: newItems });
    await storage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
  },

  clearCart: async () => {
    set({ items: [] });
    await storage.removeItem(CART_STORAGE_KEY);
  },

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
  },

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },
}));
