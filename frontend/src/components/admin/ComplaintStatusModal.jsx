import React, { useState, useEffect, useRef } from 'react';
import { useUpdateComplaintStatus } from '../../hooks/useUpdateComplaintStatus';
import { X, Loader2 } from 'lucide-react';
import './admin.css';


const ComplaintStatusModal = ({ complaint, onClose }) => {
  const modalRef = useRef(null);
  const previouslyFocusedElement = useRef(null);
  const getAllowedTransitions = (currentStatus) => {
    switch (currentStatus) {
      case 'SUBMITTED': return ['UNDER_REVIEW'];
      case 'UNDER_REVIEW': return ['APPROVED', 'REJECTED'];
      case 'APPROVED': return ['RESOLVED'];
      case 'REJECTED': return [];
      case 'RESOLVED': return [];
      default: return [];
    }
  };

  const validStatuses = getAllowedTransitions(complaint?.status);

  const [status, setStatus] = useState(validStatuses.length > 0 ? validStatuses[0] : '');
  const [remarks, setRemarks] = useState('');
  const { mutate: updateStatus, isPending, error } = useUpdateComplaintStatus();

  useEffect(() => {
    // Save previous focus
    previouslyFocusedElement.current = document.activeElement;
    
    // Focus the modal
    if (modalRef.current) {
      modalRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore previous focus
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [onClose]);

  if (!complaint) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStatus(
      { complaintId: complaint.id, status, remarks },
      { onSuccess: () => onClose() }
    );
  };

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
      >
        <div className="modal-header">
          <h3 className="modal-title" id="modal-title">Update Status</h3>
          <button className="close-btn" onClick={onClose} disabled={isPending} aria-label="Close modal"><X size={24} /></button>
        </div>

        {error && <div className="auth-error">{error.message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Status</label>
            {validStatuses.length === 0 ? (
              <div className="auth-input" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
                Terminal Status
              </div>
            ) : (
              <select
                className="auth-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isPending}
              >
                {validStatuses.map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            )}
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Admin Comments (Optional)</label>
            <textarea
              className="auth-input"
              style={{ minHeight: '80px', resize: 'vertical' }}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Reason for status change..."
              disabled={isPending}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isPending}>
              Cancel
            </button>
            <button type="submit" className="auth-button" style={{ width: 'auto', margin: 0 }} disabled={isPending || validStatuses.length === 0}>
              {isPending ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintStatusModal;
