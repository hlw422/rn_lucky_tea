import { apiClient } from './api-client';
import type { Category, Goods } from '../types';

interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

export const goodsService = {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  },

  async getGoods(categoryId?: number): Promise<Goods[]> {
    const params: Record<string, string> = {};
    if (categoryId !== undefined) {
      params.categoryId = categoryId.toString();
    }
    const response = await apiClient.get<ApiResponse<Goods[]>>('/goods', params);
    // MySQL decimal 字段返回字符串，需要转换为数字
    return response.data.map(item => ({
      ...item,
      originalPrice: Number(item.originalPrice),
    }));
  },
};
