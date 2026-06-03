import { create } from 'zustand';
import type { Order } from '../types';
import { orderService } from '../services/order-service';

interface OrderState {
  orders: Order[];
  isLoading: boolean;

  loadOrders: (status?: string) => Promise<void>;
  createOrder: (orderData: {
    address: string;
    goodsName: string;
    price: number;
  }) => Promise<Order>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,

  loadOrders: async (status?: string) => {
    set({ isLoading: true });
    try {
      const orders = await orderService.getOrders(status);
      set({ orders, isLoading: false });
    } catch (error) {
      console.error('Load orders error:', error);
      set({ isLoading: false });
    }
  },

  createOrder: async (orderData) => {
    set({ isLoading: true });
    try {
      const order = await orderService.createOrder(orderData);
      set((state) => ({ 
        orders: [order, ...state.orders], 
        isLoading: false 
      }));
      return order;
    } catch (error) {
      console.error('Create order error:', error);
      set({ isLoading: false });
      throw error;
    }
  },
}));
