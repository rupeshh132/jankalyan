import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../api/authApi';
import api, { setAccessToken } from '../api/axiosInstance';
import { useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Silent refresh on mount
    let isMounted = true;
    const hydrate = async () => {
      try {
        const response = await api.post('/auth/refresh');
        if (response.data?.data && isMounted) {
          const authData = response.data.data;
          setAccessToken(authData.accessToken);
          try {
            const payload = JSON.parse(atob(authData.accessToken.split('.')[1]));
            setUser({ accessToken: authData.accessToken, role: authData.role, id: payload.userId });
          } catch (e) {
            setUser({ accessToken: authData.accessToken, role: authData.role });
          }
        }
      } catch (error) {
        setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    hydrate();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    // Listen for axios interceptor events
    const handleAuthRefresh = (e) => {
      const authData = e.detail;
      try {
        const payload = JSON.parse(atob(authData.accessToken.split('.')[1]));
        setUser({ accessToken: authData.accessToken, role: authData.role, id: payload.userId });
      } catch (err) {
        setUser({ accessToken: authData.accessToken, role: authData.role });
      }
    };

    const handleAuthLogout = () => {
      handleLocalLogout();
    };

    window.addEventListener('auth_refresh', handleAuthRefresh);
    window.addEventListener('auth_logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth_refresh', handleAuthRefresh);
      window.removeEventListener('auth_logout', handleAuthLogout);
    };
  }, []);

  useEffect(() => {
    // Cross-tab synchronization
    const channel = new BroadcastChannel('auth_channel');
    channel.onmessage = (event) => {
      if (event.data === 'LOGOUT') {
        handleLocalLogout();
      }
    };
    return () => channel.close();
  }, []);

  const handleLocalLogout = () => {
    setAccessToken(null);
    setUser(null);
    queryClient.clear();
    window.location.href = '/login';
  };

  const login = (userData) => {
    setAccessToken(userData.accessToken);
    try {
      const payload = JSON.parse(atob(userData.accessToken.split('.')[1]));
      setUser({ ...userData, id: payload.userId });
    } catch (e) {
      setUser(userData);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      const channel = new BroadcastChannel('auth_channel');
      channel.postMessage('LOGOUT');
      channel.close();
      handleLocalLogout();
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
