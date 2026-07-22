import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import HomePage from '../pages/public/HomePage';
import PublicComplaintDetailsPage from '../pages/public/PublicComplaintDetailsPage';
import DashboardPage from '../pages/citizen/DashboardPage';
import MyComplaintsPage from '../pages/citizen/MyComplaintsPage';
import ReportComplaintPage from '../pages/citizen/ReportComplaintPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ComplaintManagementPage from '../pages/admin/ComplaintManagementPage';
import AdminRoute from './AdminRoute';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="complaints/:complaintId" element={<PublicComplaintDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Citizen Routes */}
        <Route path="dashboard" element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
          <Route path="complaints" element={<MyComplaintsPage />} />
          <Route path="report" element={<ReportComplaintPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="complaints" element={<ComplaintManagementPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
