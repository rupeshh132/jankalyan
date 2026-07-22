import React from 'react';
import '../complaint/complaint.css';
import './admin.css';

const AdminLoadingSkeleton = ({ type = 'cards' }) => {
  if (type === 'cards') {
    return (
      <div className="dashboard-grid loading-skeleton">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="dashboard-card" style={{ height: '120px' }}></div>
        ))}
      </div>
    );
  }

  return (
    <div className="admin-table-container loading-skeleton" style={{ height: '400px' }}></div>
  );
};

export default AdminLoadingSkeleton;
