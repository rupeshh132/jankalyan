import React, { useState, useEffect } from 'react';
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
import { ArrowLeft, MapPin, Calendar, Hash, FolderOpen, Heart, Trash2 } from 'lucide-react';
import '../../components/complaint/complaint.css';

const PublicComplaintDetailsPage = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data, isLoading, isError, error } = useComplaintDetails(complaintId);
  
  // Optimistic UI State
  const [optimisticUpvoted, setOptimisticUpvoted] = useState(false);
  const [optimisticCount, setOptimisticCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const complaint = data?.data;

  useEffect(() => {
    if (complaint) {
      setOptimisticUpvoted(complaint.isUpvotedByCurrentUser);
      setOptimisticCount(complaint.upvoteCount || 0);
    }
  }, [complaint]);

  const { mutate: toggleUpvote } = useToggleUpvote();
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

  const handleUpvote = () => {
    if (!user) {
      toast.error('Please login to upvote this complaint');
      return;
    }
    
    // Instantly apply optimistic update
    const previousUpvoted = optimisticUpvoted;
    const previousCount = optimisticCount;
    
    setOptimisticUpvoted(!previousUpvoted);
    setOptimisticCount(previousUpvoted ? previousCount - 1 : previousCount + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    toggleUpvote(complaint.id, {
      onSuccess: (updatedComplaint) => {
        // Manually update the cache for instant sync
        queryClient.setQueriesData({ queryKey: ['complaint', complaint.id] }, (oldData) => {
          if (!oldData) return oldData;
          return updatedComplaint.data; // The backend returns ComplaintResponse
        });
        
        // Also sync the list view caches if they exist
        queryClient.setQueriesData({ queryKey: ['publicComplaints'] }, (oldData) => {
          if (!oldData || !oldData.content) return oldData;
          return {
            ...oldData,
            content: oldData.content.map(c => c.id === complaint.id ? updatedComplaint.data : c)
          };
        });
      },
      onError: () => {
        // Revert on failure
        setOptimisticUpvoted(previousUpvoted);
        setOptimisticCount(previousCount);
        toast.error('Failed to toggle upvote');
      }
    });
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
              style={{ width: 'auto', background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-light)', textDecoration: 'none' }} 
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

        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--primary)' }}>Description</h3>
          <p style={{ margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text-primary)', fontSize: '1.05rem' }}>
            {complaint.description}
          </p>
        </div>
        
        {complaint.address && (
          <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
             <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Location</h4>
             <p style={{ margin: 0, color: 'var(--text-primary)' }}>{complaint.address}, {complaint.ward && `${complaint.ward}, `} {complaint.state}</p>
          </div>
        )}

        <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <button 
             onClick={handleUpvote}
             style={{ 
               display: 'flex', 
               alignItems: 'center', 
               gap: '0.5rem', 
               background: optimisticUpvoted ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-card)', 
               color: optimisticUpvoted ? '#ef4444' : 'var(--text-primary)', 
               padding: '0.5rem 1rem', 
               borderRadius: '20px', 
               fontWeight: 'bold', 
               border: optimisticUpvoted ? '1px solid #ef4444' : '1px solid var(--border-light)', 
               cursor: 'pointer', 
               transition: 'all 0.2s',
               transform: isAnimating ? 'scale(0.95)' : 'scale(1)'
             }}
           >
             <Heart 
                size={18} 
                fill={optimisticUpvoted ? '#ef4444' : 'none'} 
                color={optimisticUpvoted ? '#ef4444' : 'currentColor'}
                className={isAnimating && optimisticUpvoted ? 'animate-heart-pop' : ''}
             /> 
             <span>{optimisticCount} Upvotes</span>
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
