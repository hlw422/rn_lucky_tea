import client from './client';

export interface Order {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  orderNum: string;
  address: string;
  goodsName: string;
  price: number;
  time: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface OrderListResponse {
  list: Order[];
  total: number;
  page: number;
  pageSize: number;
}

export const ordersApi = {
  getList: (params?: { page?: number; pageSize?: number; status?: string }) =>
    client.get<any, { code: number; data: OrderListResponse }>('/admin/orders', { params }),

  updateStatus: (id: number, status: Order['status']) =>
    client.put<any, { code: number; message: string }>(`/admin/orders/${id}/status`, { status }),
};
