import React from 'react';
import { FileQuestion } from 'lucide-react';
import './complaint.css';

const EmptyState = ({ message = "No complaints found." }) => {
  return (
    <div className="empty-state">
      <FileQuestion size={48} className="empty-state-icon" />
      <h3>Nothing here yet</h3>
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;
