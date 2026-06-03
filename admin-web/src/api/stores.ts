import client from './client';

export interface Store {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  businessHours: string;
  phone: string;
  created_at?: string;
}

export interface StoreListResponse {
  list: Store[];
  total: number;
  page: number;
  pageSize: number;
}

export const storesApi = {
  getList: (params?: { page?: number; pageSize?: number }) =>
    client.get<any, { code: number; data: StoreListResponse }>('/admin/stores', { params }),

  create: (data: Omit<Store, 'id' | 'created_at'>) =>
    client.post<any, { code: number; data: Store }>('/admin/stores', data),

  update: (id: number, data: Omit<Store, 'id' | 'created_at'>) =>
    client.put<any, { code: number; message: string }>(`/admin/stores/${id}`, data),

  delete: (id: number) =>
    client.delete<any, { code: number; message: string }>(`/admin/stores/${id}`),
};
