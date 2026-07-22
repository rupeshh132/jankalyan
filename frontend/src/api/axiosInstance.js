import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true,
  timeout: 10000,
});

let refreshPromise = null;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        if (!refreshPromise) {
          refreshPromise = axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, {
            withCredentials: true
          }).finally(() => {
            refreshPromise = null;
          });
        }
        
        const refreshResponse = await refreshPromise;
        
        // If the backend returns a new access token in the response body
        if (refreshResponse.data && refreshResponse.data.accessToken) {
          localStorage.setItem('accessToken', refreshResponse.data.accessToken);
          // Also might need to update role if sent
          if (refreshResponse.data.role) {
            localStorage.setItem('role', refreshResponse.data.role);
          }
          
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          return api(originalRequest);
        } else {
          // If the backend handles refresh purely via HttpOnly cookies and just says OK
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed -> logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
