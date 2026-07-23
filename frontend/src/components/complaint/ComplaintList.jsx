import React from 'react';
import ComplaintCard from './ComplaintCard';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';
import Pagination from './Pagination';
import './complaint.css';

const ComplaintList = ({ isLoading, isError, error, data, onPageChange, refetch }) => {
  if (isLoading) return <LoadingSkeleton />;
  
  if (isError) {
    return (
      <div className="auth-error" style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <span>{error?.response?.data?.message || error?.message || 'Error loading complaints'}</span>
        {refetch && (
          <button className="auth-button" style={{ width: 'auto', padding: '8px 16px' }} onClick={() => refetch()}>
            Retry
          </button>
        )}
      </div>
    );
  }

  // data is already the payload (Page object or Array) because complaintApi extracts response.data.data
  const isPage = data && data.content !== undefined;
  const content = isPage ? data.content : (Array.isArray(data) ? data : []);

  if (!content.length) return <EmptyState />;

  return (
    <div>
      <div className="complaint-list-container">
        {content.map(complaint => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))}
      </div>
      
      {/* Pagination controls */}
      {isPage && data.totalPages > 1 && (
        <Pagination 
          currentPage={data.pageable?.pageNumber || 0}
          totalPages={data.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ComplaintList;
