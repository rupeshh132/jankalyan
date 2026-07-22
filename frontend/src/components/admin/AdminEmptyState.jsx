import React from 'react';
import { Database } from 'lucide-react';
import '../complaint/complaint.css';

const AdminEmptyState = ({ message = "No data found." }) => {
  return (
    <div className="empty-state">
      <Database size={48} className="empty-state-icon" />
      <h3>No Records</h3>
      <p>{message}</p>
    </div>
  );
};

export default AdminEmptyState;
