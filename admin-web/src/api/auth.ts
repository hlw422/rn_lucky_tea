import client from './client';

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export const authApi = {
  login: (params: LoginParams) =>
    client.post<any, { code: number; data: LoginResponse }>('/admin/login', params),
};
