import { create } from 'zustand';
import { storage } from '../utils/storage';
import type { Coupon } from '../types';
import { couponService } from '../services/coupon-service';

const SAVED_COUPONS_KEY = 'saved_coupons';

interface CouponState {
  coupons: Coupon[];
  savedCouponIds: number[];
  isLoading: boolean;

  loadCoupons: () => Promise<void>;
  saveCoupon: (couponId: number) => Promise<void>;
  isCouponSaved: (couponId: number) => boolean;
  loadSavedCoupons: () => Promise<void>;
}

export const useCouponStore = create<CouponState>((set, get) => ({
  coupons: [],
  savedCouponIds: [],
  isLoading: false,

  loadCoupons: async () => {
    set({ isLoading: true });
    try {
      const coupons = await couponService.getCoupons();
      set({ coupons, isLoading: false });
    } catch (error) {
      console.error('Load coupons error:', error);
      set({ isLoading: false });
    }
  },

  saveCoupon: async (couponId: number) => {
    const { savedCouponIds } = get();
    if (savedCouponIds.includes(couponId)) return;

    const newSavedIds = [...savedCouponIds, couponId];
    set({ savedCouponIds: newSavedIds });
    await storage.setItem(SAVED_COUPONS_KEY, JSON.stringify(newSavedIds));
  },

  isCouponSaved: (couponId: number) => {
    return get().savedCouponIds.includes(couponId);
  },

  loadSavedCoupons: async () => {
    try {
      const savedData = await storage.getItem(SAVED_COUPONS_KEY);
      const savedCouponIds = savedData ? JSON.parse(savedData) : [];
      set({ savedCouponIds });
    } catch (error) {
      console.error('Load saved coupons error:', error);
    }
  },
}));
