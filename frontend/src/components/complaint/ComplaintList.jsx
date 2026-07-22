import React from 'react';
import ComplaintCard from './ComplaintCard';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';
import './complaint.css';

const ComplaintList = ({ isLoading, isError, error, data, onPageChange }) => {
  if (isLoading) return <LoadingSkeleton />;
  
  if (isError) {
    return (
      <div className="auth-error" style={{ margin: '2rem 0' }}>
        {error?.response?.data?.message || error?.message || 'Error loading complaints'}
      </div>
    );
  }

  // Handle ApiResponse standard format where the page is in response.data.data
  const pageData = data?.data;
  const content = pageData?.content || [];

  if (!content.length) return <EmptyState />;

  return (
    <div>
      <div className="complaint-list-container">
        {content.map(complaint => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))}
      </div>
      
      {/* Pagination controls */}
      {pageData && pageData.totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            disabled={pageData.page === 0} 
            onClick={() => onPageChange(pageData.page - 1)}
          >
            Previous
          </button>
          <span>Page {pageData.page + 1} of {pageData.totalPages}</span>
          <button 
            className="pagination-btn"
            disabled={pageData.page === pageData.totalPages - 1} 
            onClick={() => onPageChange(pageData.page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ComplaintList;
