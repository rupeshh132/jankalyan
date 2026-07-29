import React from 'react';
import { Link } from 'react-router-dom';
import ComplaintStatusBadge from './ComplaintStatusBadge';
import { MapPin, Calendar, Heart, Tag, Copy } from 'lucide-react';
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
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <MapPin size={14} />
                <span className="text-sm">{complaint.city || 'Unknown City'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <Calendar size={14} />
                <span className="text-sm">{formatDate(complaint.createdAt)}</span>
              </div>
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginLeft: 'auto', marginRight: '8px', cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigator.clipboard.writeText(complaint.id);
                  toast.success('Complaint ID copied!');
                }}
                title="Copy Full Complaint ID"
              >
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded border flex items-center gap-1 hover:bg-gray-200 transition-colors">
                  ID: {complaint.id?.split('-')[0]}
                  <Copy size={10} className="ml-1 opacity-70" />
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="track-btn hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/dashboard/track?id=${complaint.id}`;
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.25rem',
                  padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--border-color)',
                  background: 'transparent', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-primary)'
                }}
              >
                Track
              </button>

              <button 
                className={`vote-badge ${complaint.isUpvotedByCurrentUser ? 'active' : ''}`}
                onClick={handleUpvote}
                disabled={isPending}
                style={{
                  cursor: isPending ? 'wait' : 'pointer',
                  background: complaint.isUpvotedByCurrentUser ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                  color: complaint.isUpvotedByCurrentUser ? '#ef4444' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.2s',
                  transform: isPending ? 'scale(0.95)' : 'scale(1)'
                }}
              >
                <Heart 
                  size={14} 
                  fill={complaint.isUpvotedByCurrentUser ? '#ef4444' : 'none'} 
                  color={complaint.isUpvotedByCurrentUser ? '#ef4444' : 'currentColor'}
                  className={complaint.isUpvotedByCurrentUser ? 'animate-heart-pop' : ''}
                />
                <span>{complaint.upvoteCount || 0}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ComplaintCard;
