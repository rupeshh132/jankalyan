import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    } else if (user.role !== 'ADMIN') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return <Outlet />;
};

export default AdminRoute;
