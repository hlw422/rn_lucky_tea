import { apiClient } from './api-client';
import type { Order } from '../types';

interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

export const orderService = {
  async getOrders(status?: string): Promise<Order[]> {
    const params: Record<string, string> = {};
    if (status) {
      params.status = status;
    }
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders', params);
    // MySQL decimal 字段返回字符串，需要转换为数字
    return response.data.map(item => ({
      ...item,
      price: Number(item.price),
    }));
  },

  async createOrder(orderData: {
    address: string;
    goodsName: string;
    price: number;
  }): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', orderData);
    return {
      ...response.data,
      price: Number(response.data.price),
    };
  },
};
