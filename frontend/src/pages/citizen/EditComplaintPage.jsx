import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ComplaintForm from '../../components/complaint/ComplaintForm';
import { useComplaintDetails } from '../../hooks/useComplaintDetails';
import LoadingSkeleton from '../../components/complaint/LoadingSkeleton';
import { ArrowLeft } from 'lucide-react';

const EditComplaintPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useComplaintDetails(id);

  if (isLoading) {
    return (
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <LoadingSkeleton />
      </div>
    );
  }

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
    <div className="page-container" style={{ padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '1.5rem' }}>
        <Link to="/dashboard/complaints" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius)' }}>
          <ArrowLeft size={16} /> Back to My Complaints
        </Link>
        <h1 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Edit Complaint</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Update the details of your complaint below.</p>
      </div>

      <ComplaintForm initialData={complaint} isEditMode={true} />
    </div>
  );
};

export default EditComplaintPage;
