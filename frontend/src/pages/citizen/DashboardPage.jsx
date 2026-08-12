import React, { useState } from 'react';
import { usePublicComplaints } from '../../hooks/useComplaints';
import ComplaintList from '../../components/complaint/ComplaintList';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, Rss } from 'lucide-react';
import '../../components/complaint/complaint.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, error, refetch } = usePublicComplaints({ page, size: 5 }, user?.id);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Rss size={18} style={{ color: '#2563eb' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2563eb' }}>
              Live Feed
            </span>
          </div>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Civic Feed
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#64748b', margin: '4px 0 0' }}>
            Browse issues reported by citizens in your city
          </p>
        </div>

        <Link
          to="/dashboard/report"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', background: '#111827', color: '#ffffff',
            fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
            borderRadius: '8px', textDecoration: 'none', transition: 'background 0.5s ease',
            flexShrink: 0
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
          onMouseLeave={e => e.currentTarget.style.background = '#111827'}
        >
          <Plus size={16} />
          Report Issue
        </Link>
      </div>

      {/* Feed */}
      <ComplaintList
        data={data}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onPageChange={setPage}
        refetch={refetch}
      />
    </div>
  );
};

export default DashboardPage;
