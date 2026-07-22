import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import DashboardPage from '../pages/citizen/DashboardPage';
import MyComplaintsPage from '../pages/citizen/MyComplaintsPage';
import ReportComplaintPage from '../pages/citizen/ReportComplaintPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Public Routes */}
        <Route index element={<div>Home Page Placeholder</div>} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Citizen Routes */}
        <Route path="dashboard">
          <Route index element={<DashboardPage />} />
          <Route path="complaints" element={<MyComplaintsPage />} />
          <Route path="report" element={<ReportComplaintPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="admin">
          <Route index element={<div>Admin Dashboard Placeholder</div>} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
