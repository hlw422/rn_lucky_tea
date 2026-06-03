import { create } from 'zustand';
import { storeService } from '../services/store-service';
import { getCurrentLocation, type UserLocation } from '../utils/location';
import type { Store } from '../types';

interface StoreState {
  stores: Store[];
  selectedStore: Store | null;
  userLocation: UserLocation | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchStores: () => Promise<void>;
  fetchStoreById: (id: number) => Promise<void>;
  selectStore: (store: Store | null) => void;
  getUserLocation: () => Promise<UserLocation | null>;
}

export const useStoreStore = create<StoreState>((set, get) => ({
  stores: [],
  selectedStore: null,
  userLocation: null,
  loading: false,
  error: null,
  
  // 获取用户位置
  getUserLocation: async () => {
    const location = await getCurrentLocation();
    if (location) {
      set({ userLocation: location });
    }
    return location;
  },
  
  // 获取门店列表
  fetchStores: async () => {
    set({ loading: true, error: null });
    try {
      let location = get().userLocation;
      
      // 如果没有位置信息，尝试获取
      if (!location) {
        location = await getCurrentLocation();
        if (location) {
          set({ userLocation: location });
        }
      }
      
      const stores = await storeService.getStores(
        location?.latitude,
        location?.longitude
      );
      
      set({ stores, loading: false });
    } catch (error) {
      console.error('获取门店列表失败:', error);
      set({ 
        error: error instanceof Error ? error.message : '获取门店列表失败',
        loading: false 
      });
    }
  },
  
  // 获取门店详情
  fetchStoreById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const location = get().userLocation;
      const store = await storeService.getStoreById(
        id,
        location?.latitude,
        location?.longitude
      );
      set({ selectedStore: store, loading: false });
    } catch (error) {
      console.error('获取门店详情失败:', error);
      set({ 
        error: error instanceof Error ? error.message : '获取门店详情失败',
        loading: false 
      });
    }
  },
  
  // 选择门店
  selectStore: (store: Store | null) => {
    set({ selectedStore: store });
  },
}));
