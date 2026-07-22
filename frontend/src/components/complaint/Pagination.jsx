import React from 'react';
import './pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages = [];
    // Show max 5 pages at a time
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    if (currentPage <= 2) {
      endPage = Math.min(totalPages - 1, 4);
    }
    if (currentPage >= totalPages - 3) {
      startPage = Math.max(0, totalPages - 5);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <nav className="pagination-container" aria-label="Pagination">
      <ul className="pagination-list">
        <li>
          <button
            className="pagination-button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </li>
        
        {generatePageNumbers().map(page => (
          <li key={page}>
            <button
              className={`pagination-button ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page + 1}
            </button>
          </li>
        ))}

        <li>
          <button
            className="pagination-button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            aria-label="Next page"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
