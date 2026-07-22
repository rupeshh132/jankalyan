import React from 'react';
import './admin.css';

const DashboardCard = ({ title, value }) => {
  return (
    <div className="dashboard-card">
      <span className="card-title">{title}</span>
      <span className="card-value">{value || 0}</span>
    </div>
  );
};

export default DashboardCard;
