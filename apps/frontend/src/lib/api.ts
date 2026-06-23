import axios from 'axios';
import { useToastStore } from '../stores/toastStore';

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const baseURL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api/v1';
        const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
        
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    // Show error toast
    const message = error.response?.data?.message || 'Terjadi kesalahan';
    useToastStore.getState().addToast(message, 'error');

    return Promise.reject(error);
  }
);

export default api;