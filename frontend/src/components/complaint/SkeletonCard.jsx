import React from 'react';
import { motion } from 'framer-motion';
import './complaint.css'; // Make sure this exists

const SkeletonCard = () => {
  return (
    <motion.div
      className="complaint-card skeleton-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="skeleton-header">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-meta">
          <div className="skeleton-text skeleton-name"></div>
          <div className="skeleton-text skeleton-date"></div>
        </div>
      </div>
      <div className="skeleton-body">
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text skeleton-desc line-1"></div>
        <div className="skeleton-text skeleton-desc line-2"></div>
      </div>
      <div className="skeleton-footer">
        <div className="skeleton-chip"></div>
        <div className="skeleton-chip"></div>
      </div>
    </motion.div>
  );
};

export default SkeletonCard;
