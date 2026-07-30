import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../api/authApi';
import api, { setAccessToken, refreshToken } from '../api/axiosInstance';
import { useQueryClient } from '@tanstack/react-query';
import { googleLogout } from '@react-oauth/google';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Silent refresh on mount
    let isMounted = true;
    const hydrate = async () => {
      if (localStorage.getItem('isLoggedIn') !== 'true') {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }
      try {
        const response = await refreshToken();
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
        setAccessToken(null);
        localStorage.removeItem('isLoggedIn');
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
    localStorage.removeItem('isLoggedIn');
    queryClient.clear();
    window.location.href = '/login';
  };

  const login = (userData) => {
    setAccessToken(userData.accessToken);
    localStorage.setItem('isLoggedIn', 'true');
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
      googleLogout(); // Clear Google session
      const channel = new BroadcastChannel('auth_channel');
      channel.postMessage('LOGOUT');
      channel.close();
      handleLocalLogout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
