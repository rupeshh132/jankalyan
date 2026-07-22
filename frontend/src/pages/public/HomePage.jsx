import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePublicComplaints } from '../../hooks/useComplaints';
import ComplaintList from '../../components/complaint/ComplaintList';
import '../../components/complaint/complaint.css';
import '../../components/auth/auth.css';

const HomePage = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, error } = usePublicComplaints(page, 5);

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="glass-card" style={{ textAlign: 'center', marginBottom: '3rem', padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Welcome to JanKalyan</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          Empowering citizens to report, track, and resolve local issues transparently. Together, we build a better, more accountable community.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard/report" className="auth-button" style={{ width: 'auto', margin: 0, padding: '0.75rem 2rem' }}>
            Report an Issue
          </Link>
          <Link to="/dashboard" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.75rem 2rem', borderRadius: 'var(--radius)' }}>
            View All Reports
          </Link>
        </div>
      </div>

      {/* Latest Complaints */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="page-title" style={{ fontSize: '1.8rem', margin: 0 }}>Latest Community Reports</h2>
      </div>
      
      <ComplaintList 
        data={data} 
        isLoading={isLoading} 
        isError={isError} 
        error={error} 
        onPageChange={setPage} 
      />
    </div>
  );
};

export default HomePage;
