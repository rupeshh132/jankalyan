import React from 'react';
import DashboardCard from './DashboardCard';
import AdminLoadingSkeleton from './AdminLoadingSkeleton';
import './admin.css';

const DashboardStats = ({ data, isLoading, isError, error }) => {
  if (isLoading) return <AdminLoadingSkeleton type="cards" />;

  if (isError) {
    return <div className="auth-error">Error loading dashboard: {error.message}</div>;
  }

  const stats = data?.data || {};

  return (
    <div className="dashboard-grid">
      <DashboardCard title="Total Complaints" value={stats.totalComplaints} />
      <DashboardCard title="Submitted" value={stats.submittedComplaints} />
      <DashboardCard title="Under Review" value={stats.underReviewComplaints} />
      <DashboardCard title="Approved" value={stats.approvedComplaints} />
      <DashboardCard title="Rejected" value={stats.rejectedComplaints} />
      <DashboardCard title="Resolved" value={stats.resolvedComplaints} />
    </div>
  );
};

export default DashboardStats;
