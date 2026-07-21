import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Public Routes */}
        <Route index element={<div>Home Page Placeholder</div>} />
        <Route path="login" element={<div>Login Page Placeholder</div>} />
        <Route path="register" element={<div>Register Page Placeholder</div>} />

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
