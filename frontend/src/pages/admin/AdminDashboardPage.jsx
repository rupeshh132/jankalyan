import React from 'react';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import DashboardStats from '../../components/admin/DashboardStats';
import { Link } from 'react-router-dom';
import '../../components/complaint/complaint.css';

const AdminDashboardPage = () => {
  const { data, isLoading, isError, error } = useAdminDashboard();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <Link to="/admin/complaints" className="auth-button" style={{ width: 'auto', marginTop: 0 }}>
          Manage Complaints
        </Link>
      </div>
      
      <DashboardStats data={data} isLoading={isLoading} isError={isError} error={error} />
    </div>
  );
};

export default AdminDashboardPage;
