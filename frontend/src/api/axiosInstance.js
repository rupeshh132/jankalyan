import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true,
  timeout: 120000, // Increased to 120s to handle Render free-tier cold starts
});

let refreshPromise = null;
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const refreshToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, {
      withCredentials: true
    }).finally(() => {
      refreshPromise = null;
    });
  }
  const response = await refreshPromise;
  return response;
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet, and the failed request is NOT the refresh endpoint itself
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
      if (localStorage.getItem('isLoggedIn') !== 'true') {
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await refreshToken();
        
        // If the backend returns a new access token in the response body (nested in ApiResponse.data)
        const authData = refreshResponse.data?.data;
        if (authData && authData.accessToken) {
          accessToken = authData.accessToken;
          window.dispatchEvent(new CustomEvent('auth_refresh', { detail: authData }));
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed -> logout
        accessToken = null;
        window.dispatchEvent(new CustomEvent('auth_logout'));
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
