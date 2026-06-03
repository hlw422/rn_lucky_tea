import client from './client';

export interface StatsData {
  counts: {
    users: number;
    goods: number;
    orders: number;
    stores: number;
    categories: number;
    coupons: number;
  };
  orderStats: Array<{
    status: string;
    count: number;
  }>;
  recentOrders: Array<{
    date: string;
    count: number;
  }>;
}

export const statsApi = {
  getStats: () =>
    client.get<any, { code: number; data: StatsData }>('/admin/stats'),
};
