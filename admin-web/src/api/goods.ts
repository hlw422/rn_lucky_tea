import client from './client';

export interface Goods {
  id: number;
  categoryId: number;
  categoryName?: string;
  name: string;
  characteristic: string;
  originalPrice: number;
  pic: string;
}

export interface GoodsListResponse {
  list: Goods[];
  total: number;
  page: number;
  pageSize: number;
}

export const goodsApi = {
  getList: (params?: { page?: number; pageSize?: number; categoryId?: number }) =>
    client.get<any, { code: number; data: GoodsListResponse }>('/admin/goods', { params }),

  create: (data: Omit<Goods, 'id' | 'categoryName'>) =>
    client.post<any, { code: number; data: Goods }>('/admin/goods', data),

  update: (id: number, data: Omit<Goods, 'id' | 'categoryName'>) =>
    client.put<any, { code: number; message: string }>(`/admin/goods/${id}`, data),

  delete: (id: number) =>
    client.delete<any, { code: number; message: string }>(`/admin/goods/${id}`),
};
