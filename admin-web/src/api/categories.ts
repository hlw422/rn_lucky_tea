import client from './client';

export interface Category {
  id: number;
  name: string;
  description: string;
}

export const categoriesApi = {
  getList: () =>
    client.get<any, { code: number; data: Category[] }>('/admin/categories'),

  create: (data: Omit<Category, 'id'>) =>
    client.post<any, { code: number; data: Category }>('/admin/categories', data),

  update: (id: number, data: Omit<Category, 'id'>) =>
    client.put<any, { code: number; message: string }>(`/admin/categories/${id}`, data),

  delete: (id: number) =>
    client.delete<any, { code: number; message: string }>(`/admin/categories/${id}`),
};
