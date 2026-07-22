import React from 'react';
import ComplaintStatusBadge from './ComplaintStatusBadge';
import { MapPin, Calendar } from 'lucide-react';
import './complaint.css';

const ComplaintCard = ({ complaint }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="complaint-card">
      <div className="complaint-header">
        <h3 className="complaint-title">{complaint.title || 'Untitled'}</h3>
        <ComplaintStatusBadge status={complaint.status} />
      </div>
      
      <div className="complaint-description">
        {complaint.description}
      </div>
      
      <div className="complaint-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={14} />
          <span>{complaint.city || 'Unknown City'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={14} />
          <span>{formatDate(complaint.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
