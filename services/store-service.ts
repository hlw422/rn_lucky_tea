import { apiClient } from './api-client';
import type { Store } from '../types';

interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

export const storeService = {
  // 获取门店列表（可传入用户位置计算距离）
  async getStores(latitude?: number, longitude?: number): Promise<Store[]> {
    const params: Record<string, string> = {};
    if (latitude !== undefined) {
      params.latitude = latitude.toString();
    }
    if (longitude !== undefined) {
      params.longitude = longitude.toString();
    }
    
    const response = await apiClient.get<ApiResponse<Store[]>>('/stores', params);
    return response.data.map(item => ({
      ...item,
      latitude: Number(item.latitude),
      longitude: Number(item.longitude),
      distance: item.distance ? Number(item.distance) : undefined,
    }));
  },
  
  // 获取单个门店详情
  async getStoreById(id: number, latitude?: number, longitude?: number): Promise<Store> {
    const params: Record<string, string> = {};
    if (latitude !== undefined) {
      params.latitude = latitude.toString();
    }
    if (longitude !== undefined) {
      params.longitude = longitude.toString();
    }
    
    const response = await apiClient.get<ApiResponse<Store>>(`/stores/${id}`, params);
    const store = response.data;
    return {
      ...store,
      latitude: Number(store.latitude),
      longitude: Number(store.longitude),
      distance: store.distance ? Number(store.distance) : undefined,
    };
  },
};
