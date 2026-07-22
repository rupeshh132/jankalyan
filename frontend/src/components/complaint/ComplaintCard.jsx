import React from 'react';
import { Link } from 'react-router-dom';
import ComplaintStatusBadge from './ComplaintStatusBadge';
import { MapPin, Calendar, ThumbsUp, Tag } from 'lucide-react';
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
    <Link to={`/complaints/${complaint.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="complaint-card">
        {complaint.images && complaint.images.length > 0 && (
          <div className="complaint-thumbnail">
            <img src={complaint.images[0].imageUrl} alt="Complaint thumbnail" loading="lazy" />
          </div>
        )}
        <div className="complaint-content-wrapper">
          <div className="complaint-header">
            <h3 className="complaint-title">{complaint.title || 'Untitled'}</h3>
            <ComplaintStatusBadge status={complaint.status} />
          </div>
          
          <div className="complaint-meta">
             <div className="category-badge">
               <Tag size={12} style={{ marginRight: '4px' }} />
               {complaint.categoryName || 'General'}
             </div>
          </div>
          
          <div className="complaint-description">
            {complaint.description && complaint.description.length > 100 
              ? `${complaint.description.substring(0, 100)}...` 
              : complaint.description}
          </div>
        
          <div className="complaint-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} />
                <span className="text-sm">{complaint.city || 'Unknown City'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} />
                <span className="text-sm">{formatDate(complaint.createdAt)}</span>
              </div>
            </div>
            
            <div className="vote-badge">
              <ThumbsUp size={14} />
              <span>{complaint.voteCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ComplaintCard;
