import React, { useState, useEffect, useRef } from 'react';
import { useUpdateComplaintStatus } from '../../hooks/useUpdateComplaintStatus';
import { X, Loader2 } from 'lucide-react';
import './admin.css';

const ALL_STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RESOLVED'];

const ComplaintStatusModal = ({ complaint, onClose }) => {
  const modalRef = useRef(null);

  const availableStatuses = ALL_STATUSES.filter(s => s !== complaint?.status);
  const [status, setStatus] = useState(availableStatuses[0] || '');
  const [remarks, setRemarks] = useState('');
  const { mutate: updateStatus, isPending, error } = useUpdateComplaintStatus();

  useEffect(() => {
    if (modalRef.current) modalRef.current.focus();
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
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
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card, #fff)',
          border: '1px solid rgba(128,128,128,0.2)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.5rem 1.5rem 1rem',
          borderBottom: '1px solid rgba(128,128,128,0.15)'
        }}>
          <h3 id="modal-title" style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
            Update Status
          </h3>
          <button
            onClick={onClose}
            disabled={isPending}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem 1.5rem' }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px',
              padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.9rem'
            }}>
              {error?.response?.data?.message || 'Failed to update status'}
            </div>
          )}

          <div style={{
            background: 'rgba(128,128,128,0.08)', borderRadius: '8px',
            padding: '0.6rem 1rem', marginBottom: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)'
          }}>
            Current: <strong style={{ color: 'var(--text-primary)' }}>{formatStatus(complaint.status)}</strong>
          </div>

          <form id="status-update-form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Change Status To
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isPending}
                style={{
                  width: '100%', padding: '0.75rem 1rem',
                  border: '1px solid rgba(128,128,128,0.3)', borderRadius: '8px',
                  background: 'var(--bg-primary, #f9f9f9)', color: 'var(--text-primary)',
                  fontSize: '1rem', cursor: 'pointer', boxSizing: 'border-box'
                }}
              >
                {availableStatuses.map(s => (
                  <option key={s} value={s}>{formatStatus(s)}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Admin Remarks (Optional)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Reason for status change..."
                disabled={isPending}
                rows={3}
                style={{
                  width: '100%', padding: '0.75rem 1rem',
                  border: '1px solid rgba(128,128,128,0.3)', borderRadius: '8px',
                  background: 'var(--bg-primary, #f9f9f9)', color: 'var(--text-primary)',
                  fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </form>
        </div>

        {/* Footer — always visible, outside the scrollable body */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
          padding: '1rem 1.5rem 1.5rem',
          borderTop: '1px solid rgba(128,128,128,0.15)'
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            style={{
              padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid rgba(128,128,128,0.3)',
              background: 'rgba(128,128,128,0.1)', color: 'var(--text-primary)',
              fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="status-update-form"
            disabled={isPending || !status}
            style={{
              padding: '0.65rem 1.4rem', borderRadius: '8px', border: 'none',
              background: isPending ? 'rgba(37,99,235,0.5)' : '#2563eb',
              color: 'white', fontWeight: 700, cursor: isPending ? 'wait' : 'pointer',
              fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px',
              opacity: (!status) ? 0.5 : 1
            }}
          >
            {isPending ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Saving...
              </>
            ) : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintStatusModal;
