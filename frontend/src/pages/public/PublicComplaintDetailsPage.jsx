import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useComplaintDetails } from '../../hooks/useComplaintDetails';
import { useDeleteComplaint } from '../../hooks/useDeleteComplaint';
import { useToggleUpvote } from '../../hooks/useComplaints';
import { useAuth } from '../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import ComplaintStatusBadge from '../../components/complaint/ComplaintStatusBadge';
import LoadingSkeleton from '../../components/complaint/LoadingSkeleton';
import DeleteConfirmModal from '../../components/complaint/DeleteConfirmModal';
import { ArrowLeft, MapPin, Calendar, Hash, FolderOpen, ThumbsUp, Trash2 } from 'lucide-react';
import '../../components/complaint/complaint.css';

const PublicComplaintDetailsPage = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data, isLoading, isError, error } = useComplaintDetails(complaintId);
  const { mutateAsync: toggleUpvote, isPending: isVoting } = useToggleUpvote();
  const { mutateAsync: deleteComplaint, isPending: isDeleting } = useDeleteComplaint();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (isLoading) return <div className="page-container"><LoadingSkeleton /></div>;
  
  if (isError) {
    return (
      <div className="page-container">
        <div className="auth-error">
          {error?.response?.data?.message || error?.message || 'Error loading complaint details'}
        </div>
      </div>
    );
  }

  const complaint = data?.data;

  if (!complaint) {
    return (
      <div className="page-container">
        <div className="empty-state">Complaint not found.</div>
      </div>
    );
  }

  const isOwner = user?.id === complaint.userId;

  const handleDelete = async () => {
    try {
      await deleteComplaint({ id: complaint.id, isAdmin: user?.role === 'ADMIN' });
      setIsDeleteModalOpen(false);
      navigate(user?.role === 'ADMIN' ? '/admin/complaints' : '/dashboard/complaints');
    } catch (e) {
      // handled in hook toast
    }
  };

  const handleUpvote = async () => {
    if (!user) {
      toast.error('Please login to upvote');
      return;
    }
    try {
      await toggleUpvote(complaint.id);
      queryClient.invalidateQueries({ queryKey: ['complaint', complaint.id] });
    } catch (e) {
      toast.error('Failed to upvote');
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link to="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius)' }}>
          <ArrowLeft size={16} /> Back
        </Link>

        {isOwner && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link 
              to={`/dashboard/complaints/${complaint.id}/edit`}
              className="auth-button" 
              style={{ width: 'auto', background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)', border: '1px solid rgba(255, 255, 255, 0.2)', textDecoration: 'none' }} 
            >
              Edit
            </Link>
            <button 
              className="auth-button" 
              style={{ width: 'auto', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444' }} 
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 size={16} style={{ marginRight: '8px' }} /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: '2.2rem', margin: 0, color: 'var(--text-primary)', wordBreak: 'break-word' }}>{complaint.title}</h1>
          <ComplaintStatusBadge status={complaint.status} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Hash size={16} /> ID: {complaint.id}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FolderOpen size={16} /> {complaint.categoryName || 'General'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} /> {complaint.city} {complaint.pincode ? `- ${complaint.pincode}` : ''}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} /> {new Date(complaint.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Image Grid */}
        {complaint.images && complaint.images.length > 0 && (
          <div className="complaint-image-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {complaint.images.map((img) => (
              <a key={img.id} href={img.imageUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', height: '150px', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <img src={img.imageUrl} alt="Complaint Attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </a>
            ))}
          </div>
        )}

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid rgba(128, 128, 128, 0.2)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--primary)' }}>Description</h3>
          <p style={{ margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text-primary)', fontSize: '1.05rem' }}>
            {complaint.description}
          </p>
        </div>
        
        {complaint.address && (
          <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.01)', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.05)' }}>
             <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Location</h4>
             <p style={{ margin: 0, color: 'var(--text-primary)' }}>{complaint.address}, {complaint.ward && `${complaint.ward}, `} {complaint.state}</p>
          </div>
        )}

        <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <button 
             onClick={handleUpvote}
             disabled={isVoting}
             style={{ 
               display: 'flex', 
               alignItems: 'center', 
               gap: '0.5rem', 
               background: complaint.isUpvotedByCurrentUser ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
               color: complaint.isUpvotedByCurrentUser ? '#3b82f6' : 'var(--text-secondary)', 
               padding: '0.5rem 1rem', 
               borderRadius: '20px', 
               fontWeight: 'bold', 
               border: complaint.isUpvotedByCurrentUser ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)', 
               cursor: isVoting ? 'wait' : 'pointer', 
               transition: 'all 0.2s' 
             }}
           >
             <ThumbsUp size={16} fill={complaint.isUpvotedByCurrentUser ? '#3b82f6' : 'none'} /> 
             {complaint.upvoteCount || 0} Upvotes
           </button>
        </div>
      </div>
      
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDelete}
        isPending={isDeleting}
        title={complaint.title}
      />
    </div>
  );
};

export default PublicComplaintDetailsPage;
