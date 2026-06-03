import { apiClient } from './api-client';
import type { User } from '../types';

interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

interface LoginData {
  token: string;
  user: User;
}

interface RegisterData {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginData> {
    const response = await apiClient.post<ApiResponse<LoginData>>('/login', {
      email,
      password,
    });
    await apiClient.setToken(response.data.token);
    return response.data;
  },

  async register(email: string, password: string, name: string): Promise<RegisterData> {
    const response = await apiClient.post<ApiResponse<RegisterData>>('/register', {
      email,
      password,
      name,
    });
    await apiClient.setToken(response.data.token);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.clearToken();
  },

  async isLoggedIn(): Promise<boolean> {
    const token = await apiClient.getToken();
    return !!token;
  },
};
