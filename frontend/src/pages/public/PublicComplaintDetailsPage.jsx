import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useComplaintDetails } from '../../hooks/useComplaintDetails';
import ComplaintStatusBadge from '../../components/complaint/ComplaintStatusBadge';
import LoadingSkeleton from '../../components/complaint/LoadingSkeleton';
import { ArrowLeft, MapPin, Calendar, Hash, FolderOpen, ThumbsUp } from 'lucide-react';
import '../../components/complaint/complaint.css';
import '../../components/auth/auth.css';

const PublicComplaintDetailsPage = () => {
  const { complaintId } = useParams();
  const { data, isLoading, isError, error } = useComplaintDetails(complaintId);

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

  return (
    <div className="page-container">
      <Link to="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius)' }}>
        <ArrowLeft size={16} /> Back
      </Link>

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
            <FolderOpen size={16} /> {complaint.category?.name || 'General'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} /> {complaint.city}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} /> {new Date(complaint.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid rgba(128, 128, 128, 0.2)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--primary)' }}>Description</h3>
          <p style={{ margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text-primary)', fontSize: '1.05rem' }}>
            {complaint.description}
          </p>
        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold' }}>
             <ThumbsUp size={16} /> {complaint.upvotes || 0} Upvotes
           </div>
        </div>
      </div>
    </div>
  );
};

export default PublicComplaintDetailsPage;
