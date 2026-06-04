import axios from 'axios';

const API_BASE_URL = 'http://localhost:4002/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加 token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理错误
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // 服务器返回错误
      const { status, data } = error.response;
      if (status === 401) {
        // token 过期，清除并跳转登录
        localStorage.removeItem('admin_token');
        window.location.href = '/login';
      }
      throw new Error(data?.message || '请求失败');
    }
    throw new Error('网络错误');
  }
);

export default client;
