import React, { createContext, useState, useContext } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return { accessToken: token, role, id: payload.userId };
      } catch (e) {
        return { accessToken: token, role };
      }
    }
    return null;
  });

  const login = (userData) => {
    localStorage.setItem('accessToken', userData.accessToken);
    localStorage.setItem('role', userData.role);
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
      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
