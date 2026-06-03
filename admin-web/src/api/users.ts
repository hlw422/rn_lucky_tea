import client from './client';

export interface User {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
  role: string;
  created_at: string;
}

export interface UserListResponse {
  list: User[];
  total: number;
  page: number;
  pageSize: number;
}

export const usersApi = {
  getList: (params?: { page?: number; pageSize?: number }) =>
    client.get<any, { code: number; data: UserListResponse }>('/admin/users', { params }),
};
