import { create } from 'zustand';
import type { Category, Goods } from '../types';
import { goodsService } from '../services/goods-service';

interface GoodsState {
  categories: Category[];
  goodsList: Goods[];
  selectedCategoryId: number | null;
  isLoading: boolean;
  isLoadingGoods: boolean;

  loadCategories: () => Promise<void>;
  loadGoods: (categoryId: number) => Promise<void>;
  selectCategory: (categoryId: number) => void;
}

export const useGoodsStore = create<GoodsState>((set, get) => ({
  categories: [],
  goodsList: [],
  selectedCategoryId: null,
  isLoading: false,
  isLoadingGoods: false,

  loadCategories: async () => {
    set({ isLoading: true });
    try {
      const categories = await goodsService.getCategories();
      set({ categories, isLoading: false });
      
      if (categories.length > 0) {
        const firstCategory = categories[0];
        get().loadGoods(firstCategory.id);
        set({ selectedCategoryId: firstCategory.id });
      }
    } catch (error) {
      console.error('Load categories error:', error);
      set({ isLoading: false });
    }
  },

  loadGoods: async (categoryId: number) => {
    set({ isLoadingGoods: true, selectedCategoryId: categoryId });
    try {
      const goodsList = await goodsService.getGoods(categoryId);
      set({ goodsList, isLoadingGoods: false });
    } catch (error) {
      console.error('Load goods error:', error);
      set({ isLoadingGoods: false });
    }
  },

  selectCategory: (categoryId: number) => {
    set({ selectedCategoryId: categoryId });
    get().loadGoods(categoryId);
  },
}));
