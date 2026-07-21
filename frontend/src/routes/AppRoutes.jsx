import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Public Routes */}
        <Route index element={<div>Home Page Placeholder</div>} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Citizen Routes */}
        <Route path="dashboard" element={<div>Citizen Dashboard Placeholder</div>} />

        {/* Admin Routes */}
        <Route path="admin">
          <Route index element={<div>Admin Dashboard Placeholder</div>} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
