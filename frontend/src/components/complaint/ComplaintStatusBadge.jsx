import React from 'react';
import './complaint.css';

const ComplaintStatusBadge = ({ status }) => {
  const getBadgeClass = (statusStr) => {
    switch (statusStr?.toUpperCase()) {
      case 'SUBMITTED': return 'status-submitted';
      case 'UNDER_REVIEW': return 'status-under_review';
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      case 'RESOLVED': return 'status-resolved';
      default: return 'status-submitted';
    }
  };

  return (
    <span className={`status-badge ${getBadgeClass(status)}`}>
      {status ? status.replace('_', ' ') : 'UNKNOWN'}
    </span>
  );
};

export default ComplaintStatusBadge;
