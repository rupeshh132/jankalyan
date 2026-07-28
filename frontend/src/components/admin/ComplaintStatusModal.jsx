import React, { useState, useEffect, useRef } from 'react';
import { useUpdateComplaintStatus } from '../../hooks/useUpdateComplaintStatus';
import { X, Loader2 } from 'lucide-react';
import './admin.css';

const ALL_STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RESOLVED'];

const ComplaintStatusModal = ({ complaint, onClose }) => {
  const modalRef = useRef(null);

  // Admin can change to any status except the current one
  const availableStatuses = ALL_STATUSES.filter(s => s !== complaint?.status);

  const [status, setStatus] = useState(availableStatuses[0] || '');
  const [remarks, setRemarks] = useState('');
  const { mutate: updateStatus, isPending, error } = useUpdateComplaintStatus();

  useEffect(() => {
    if (modalRef.current) modalRef.current.focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!complaint) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!status) return;
    updateStatus(
      { complaintId: complaint.id, status, remarks },
      { onSuccess: () => onClose() }
    );
  };

  const formatStatus = (s) => s.replace(/_/g, ' ');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex="-1"
        ref={modalRef}
        style={{ maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
      >
        <div className="modal-header">
          <h3 className="modal-title" id="modal-title">Update Status</h3>
          <button className="close-btn" onClick={onClose} disabled={isPending} aria-label="Close modal">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="auth-error" style={{ marginBottom: '1rem' }}>
            {error?.response?.data?.message || error.message}
          </div>
        )}

        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 'var(--radius)',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          Current Status: <strong style={{ color: 'var(--text-primary)' }}>{formatStatus(complaint.status)}</strong>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="modal-form-group">
            <label className="modal-label">Change Status To</label>
            <select
              className="modal-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isPending}
            >
              {availableStatuses.map(s => (
                <option key={s} value={s}>{formatStatus(s)}</option>
              ))}
            </select>
          </div>

          <div className="modal-form-group">
            <label className="modal-label">Admin Remarks (Optional)</label>
            <textarea
              className="modal-input"
              style={{ minHeight: '100px', resize: 'vertical' }}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Reason for status change..."
              disabled={isPending}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn-secondary" onClick={onClose} disabled={isPending}>
              Cancel
            </button>
            <button type="submit" className="modal-btn-primary" disabled={isPending || !status}>
              {isPending
                ? <><Loader2 style={{ display: 'inline', marginRight: '6px' }} size={18} /> Saving...</>
                : 'Save Changes'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintStatusModal;
