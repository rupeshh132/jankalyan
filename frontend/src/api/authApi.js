import api from './axiosInstance';

export const authApi = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data.data;
  },
  
  // refresh is handled by interceptor, but we can expose it if needed
  refresh: async () => {
    const response = await api.post('/auth/refresh');
    return response.data.data;
  },

  googleLogin: async (data) => {
    const response = await api.post('/auth/google', data);
    return response.data.data;
  },

  sendOtp: async (data) => {
    const response = await api.post('/auth/send-otp', data);
    return response.data; // might not have data payload, just success message
  },

  verifyOtp: async (data) => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (email, otpCode, newPassword) => {
    const response = await api.post('/auth/reset-password', { email, otpCode, newPassword });
    return response.data;
  }
};
