import api from './axiosInstance';

export const authApi = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  // refresh is handled by interceptor, but we can expose it if needed
  refresh: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  }
};
