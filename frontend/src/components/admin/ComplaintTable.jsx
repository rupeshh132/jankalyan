import React, { useState } from 'react';
import ComplaintStatusBadge from '../complaint/ComplaintStatusBadge';
import ComplaintStatusModal from './ComplaintStatusModal';
import { useDeleteComplaint } from '../../hooks/useDeleteComplaint';
import { Edit2, Trash2, Loader2 } from 'lucide-react';
import './admin.css';
import '../complaint/complaint.css';

const ComplaintTable = ({ data, onPageChange }) => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const { mutate: deleteComplaint, isPending: isDeleting } = useDeleteComplaint();

  const pageData = data?.data;
  const content = pageData?.content || [];

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to soft delete this complaint?')) {
      deleteComplaint(id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US');
  };

  return (
    <>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {content.map(complaint => (
              <tr key={complaint.id}>
                <td>#{complaint.id}</td>
                <td>{complaint.title}</td>
                <td>{complaint.category?.name || 'N/A'}</td>
                <td><ComplaintStatusBadge status={complaint.status} /></td>
                <td>{formatDate(complaint.createdAt)}</td>
                <td>
                  <div className="table-actions">
                    <button 
                      className="action-btn" 
                      onClick={() => setSelectedComplaint(complaint)}
                      title="Update Status"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="action-btn delete" 
                      onClick={() => handleDelete(complaint.id)}
                      disabled={isDeleting}
                      title="Delete Complaint"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      {selectedComplaint && (
        <ComplaintStatusModal 
          complaint={selectedComplaint} 
          onClose={() => setSelectedComplaint(null)} 
        />
      )}
    </>
  );
};

export default ComplaintTable;
