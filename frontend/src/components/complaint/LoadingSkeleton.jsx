import React from 'react';
import './complaint.css';

const LoadingSkeleton = ({ count = 3 }) => {
  return (
    <div className="loading-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card"></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
