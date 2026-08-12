import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ThumbsUp, Copy, Navigation, Eye } from 'lucide-react';
import { useToggleUpvote } from '../../hooks/useComplaints';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './complaint.css';

const ComplaintCard = ({ complaint }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const { user } = useAuth();
  const { mutate: toggleUpvote } = useToggleUpvote();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLargeHeart, setShowLargeHeart] = useState(false);
  const clickTimeout = useRef(null);
  const navigate = useNavigate();

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      if (!user) { toast.error('Please login to upvote'); return; }
      setShowLargeHeart(true);
      setTimeout(() => setShowLargeHeart(false), 800);
      if (!complaint.isUpvotedByCurrentUser) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
        toggleUpvote(complaint.id, { onError: () => toast.error('Failed to toggle upvote') });
      }
    } else {
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null;
        navigate(`/complaints/${complaint.id}`);
      }, 250);
    }
  };

  const handleUpvote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please login to upvote'); return; }
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    toggleUpvote(complaint.id, { onError: () => toast.error('Failed to toggle upvote') });
  };

  const isUpvoted = complaint.isUpvotedByCurrentUser;

  // Category Color Mapping
  const getCategoryColor = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('safety')) return '#ef4444'; // Terracotta red
    if (name.includes('electric')) return '#f59e0b'; // Amber
    if (name.includes('drainage') || name.includes('water')) return '#2563eb'; // Deep blue
    if (name.includes('garbage') || name.includes('waste')) return '#059669'; // Forest green
    if (name.includes('road')) return '#4b5563'; // Slate
    return '#9ca3af'; // Default gray
  };

  const accentColor = getCategoryColor(complaint.categoryName);
  
  // Status Class Mapping
  const statusClass = complaint.status ? complaint.status.toLowerCase() : 'submitted';
  const statusDisplay = complaint.status ? complaint.status.replace('_', ' ') : 'Submitted';

  return (
    <Link to={`/complaints/${complaint.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div 
        className="editorial-card" 
        style={{ '--accent-color': accentColor }}
      >
        
        {/* Category Eyebrow & Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="editorial-eyebrow">
            {complaint.categoryName || 'General'}
          </div>
          <div className="editorial-status">
            <span className={`editorial-status-dot status-dot-${statusClass}`}></span>
            <span className={`status-text-${statusClass}`} style={{ textTransform: 'capitalize' }}>
              {statusDisplay}
            </span>
          </div>
        </div>

        {/* Thumbnail (if exists) */}
        {complaint.images && complaint.images.length > 0 && (
          <div
            style={{ width: '100%', height: '180px', borderRadius: '4px', overflow: 'hidden', position: 'relative', cursor: 'pointer', marginBottom: '8px' }}
            onClick={handleImageClick}
          >
            <img src={complaint.images[0].imageUrl} alt="Complaint" loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} />
            <AnimatePresence>
              {showLargeHeart && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1.2 }}
                  exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}
                  style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 10, pointerEvents: 'none' }}
                >
                  <ThumbsUp size={72} fill="#ffffff" color="#ffffff" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Title */}
        <h3 className="editorial-title">
          {complaint.title || 'Untitled Issue'}
        </h3>

        {/* Description Snippet */}
        {complaint.description && (
          <p style={{
            fontFamily: 'Inter, sans-serif', color: '#4b5563', fontSize: '14px',
            lineHeight: 1.6, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {complaint.description}
          </p>
        )}

        {/* Meta Row */}
        <div className="editorial-meta-row">
          {/* Location & Date & ID */}
          <div className="editorial-meta-info">
            {complaint.city && (
              <div className="editorial-meta-item">
                <MapPin size={14} />
                <span>{complaint.city}</span>
              </div>
            )}
            {complaint.createdAt && (
              <div className="editorial-meta-item">
                <Calendar size={14} />
                <span>{formatDate(complaint.createdAt)}</span>
              </div>
            )}
            <div 
              className="editorial-id"
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                navigator.clipboard.writeText(complaint.id);
                toast.success('ID copied!');
              }}
              title="Copy ID"
            >
              #{complaint.id?.substring(0, 8)} <Copy size={10} style={{ display: 'inline', marginLeft: '2px' }} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="editorial-actions">
            <button
              className="editorial-ghost-btn no-border"
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                navigate(`/dashboard/track?id=${complaint.id}`);
              }}
            >
              <Eye size={16} />
              Track
            </button>
            <button
              className={`editorial-ghost-btn ${isUpvoted ? 'active' : ''}`}
              onClick={handleUpvote}
            >
              <ThumbsUp
                size={16}
                fill={isUpvoted ? 'currentColor' : 'transparent'}
                className={isAnimating ? 'animate-heart-pop' : ''}
              />
              Upvote ({complaint.upvoteCount || 0})
            </button>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default ComplaintCard;
