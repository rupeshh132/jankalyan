import React from 'react';
import { Loader2, AlertTriangle, X } from 'lucide-react';
import './complaint.css';


const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, isPending, title }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} disabled={isPending}>
          <X size={20} />
        </button>
        
        <div className="modal-header">
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h2 className="auth-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Delete Complaint?</h2>
          <p className="text-gray" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            Are you sure you want to delete "{title || 'this complaint'}"? This action cannot be undone.
          </p>
        </div>

        <div className="modal-actions" style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="auth-button" 
            style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff' }} 
            onClick={onClose} 
            disabled={isPending}
          >
            Cancel
          </button>
          <button 
            className="auth-button" 
            style={{ background: '#ef4444' }} 
            onClick={onConfirm} 
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" size={18} /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
