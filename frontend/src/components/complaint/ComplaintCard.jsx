import React from 'react';
import { Link } from 'react-router-dom';
import ComplaintStatusBadge from './ComplaintStatusBadge';
import { MapPin, Calendar, ThumbsUp, Tag } from 'lucide-react';
import { useToggleUpvote } from '../../hooks/useComplaints';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
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

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { mutate: toggleUpvote, isPending } = useToggleUpvote();

  const handleUpvote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to upvote');
      return;
    }

    if (isPending) return;

    toggleUpvote(complaint.id, {
      onSuccess: () => {
        // Invalidate queries to refresh the feed
        queryClient.invalidateQueries({ queryKey: ['publicComplaints'] });
      },
      onError: (error) => {
        toast.error('Failed to toggle upvote');
      }
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
            
            <button 
              className={`vote-badge ${complaint.isUpvotedByCurrentUser ? 'active' : ''}`}
              onClick={handleUpvote}
              disabled={isPending}
              style={{
                cursor: isPending ? 'wait' : 'pointer',
                background: complaint.isUpvotedByCurrentUser ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                color: complaint.isUpvotedByCurrentUser ? '#3b82f6' : 'var(--text-secondary)',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'all 0.2s'
              }}
            >
              <ThumbsUp size={14} fill={complaint.isUpvotedByCurrentUser ? '#3b82f6' : 'none'} />
              <span>{complaint.upvoteCount || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ComplaintCard;
