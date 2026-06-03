import { apiClient } from './api-client';
import type { Coupon } from '../types';

interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

export const couponService = {
  async getCoupons(): Promise<Coupon[]> {
    const response = await apiClient.get<ApiResponse<Coupon[]>>('/coupons');
    // MySQL decimal 字段返回字符串，需要转换为数字
    return response.data.map(item => ({
      ...item,
      discount: Number(item.discount),
    }));
  },

  async saveCoupon(couponId: number): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`/coupons/${couponId}/save`);
  },
};
