import React from 'react';
import SkeletonCard from './SkeletonCard';
import './complaint.css';

const LoadingSkeleton = ({ count = 3 }) => {
  return (
    <div className="complaint-list-container">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
