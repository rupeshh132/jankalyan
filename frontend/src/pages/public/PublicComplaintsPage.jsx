import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { usePublicComplaints } from '../../hooks/useComplaints';
import { useDebounce } from '../../hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import ComplaintList from '../../components/complaint/ComplaintList';
import { Search, PenLine } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PublicComplaintsPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '0', 10);
  const sort = searchParams.get('sort') || 'createdAt,desc';
  const categoryId = searchParams.get('categoryId') || '';
  const status = searchParams.get('status') || '';
  const searchParam = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(searchParam);
  const debouncedSearch = useDebounce(searchInput, 400);

  const updateParams = (updates, replace = false) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      Object.keys(updates).forEach(key => {
        const value = updates[key];
        if (value === null || value === '') newParams.delete(key);
        else newParams.set(key, value);
      });
      if (!Object.keys(updates).includes('page')) newParams.set('page', '0');
      return newParams;
    }, { replace });
  };

  useEffect(() => {
    if (debouncedSearch !== searchParam) {
      updateParams({ search: debouncedSearch || null }, true);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (searchParam !== debouncedSearch) {
      setSearchInput(searchParam);
    }
  }, [searchParam]);

  const { data, isLoading, isError, error, refetch } = usePublicComplaints({
    page,
    size: 10,
    sort,
    search: debouncedSearch || null,
    categoryId: categoryId || null,
    status: status || null
  }, user?.id);

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    }
  });
  
  const categories = categoriesData?.data || [];

  return (
    <div style={{ background: '#fdfdfc', minHeight: '100vh', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', color: '#6b7280', textTransform: 'uppercase', marginBottom: '12px' }}>
            Public Board
          </p>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '48px', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Community Reports
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#6b7280', marginTop: '16px', maxWidth: '600px', margin: '16px auto 0' }}>
            Discover and track civic issues reported by citizens in your area. Transparency and action, driven by the community.
          </p>
        </div>

        {/* Minimal Inline Filters */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '24px',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '40px'
        }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '99px', padding: '8px 16px', flex: '1', minWidth: '280px', maxWidth: '400px' }}>
            <Search size={16} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent', marginLeft: '12px', fontFamily: 'Inter, sans-serif', fontSize: '14px', width: '100%', color: '#111827' }}
            />
          </div>

          {/* Selects */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select 
              value={status} 
              onChange={(e) => updateParams({ status: e.target.value })}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', padding: '8px 16px', borderRadius: '99px', border: '1px solid #e5e7eb', background: '#ffffff', color: '#4b5563', cursor: 'pointer', outline: 'none', boxShadow: 'none' }}
            >
              <option value="">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select 
              value={categoryId} 
              onChange={(e) => updateParams({ categoryId: e.target.value })}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', padding: '8px 16px', borderRadius: '99px', border: '1px solid #e5e7eb', background: '#ffffff', color: '#4b5563', cursor: 'pointer', outline: 'none', boxShadow: 'none' }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <select 
              value={sort} 
              onChange={(e) => updateParams({ sort: e.target.value })}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', padding: '8px 16px', borderRadius: '99px', border: '1px solid #e5e7eb', background: '#ffffff', color: '#4b5563', cursor: 'pointer', outline: 'none', boxShadow: 'none' }}
            >
              <option value="createdAt,desc">Newest First</option>
              <option value="createdAt,asc">Oldest First</option>
              <option value="upvoteCount,desc">Most Upvoted</option>
            </select>
          </div>
        </div>

        {/* List */}
        <ComplaintList
          isLoading={isLoading}
          isError={isError}
          error={error}
          data={data}
          onPageChange={handlePageChange}
          refetch={refetch}
        />

        {/* Call To Action (Want to report?) */}
        {!user && (
          <div style={{ 
            marginTop: '80px', 
            padding: '60px 40px', 
            background: '#FAFAFF', 
            border: '1px solid #e5e7eb', 
            borderRadius: '16px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            
            {/* Local Styles for Blob Animation */}
            <style>{`
              @keyframes cta-blob-1 {
                0%, 100% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(15%, -10%) scale(1.05); }
                66% { transform: translate(-10%, 15%) scale(0.95); }
              }
              @keyframes cta-blob-2 {
                0%, 100% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(-15%, 10%) scale(1.05); }
                66% { transform: translate(10%, -15%) scale(0.95); }
              }
              @keyframes cta-blob-3 {
                0%, 100% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(10%, 15%) scale(0.95); }
                66% { transform: translate(-15%, -10%) scale(1.05); }
              }
              @media (prefers-reduced-motion: reduce) {
                .mesh-blob { animation: none !important; }
              }
            `}</style>

            {/* Background Gradient Mesh */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none' }}>
              <div className="mesh-blob" style={{ position: 'absolute', top: '-20%', left: '-20%', width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(162, 233, 255, 0.8) 0%, rgba(162, 233, 255, 0) 70%)', borderRadius: '50%', filter: 'blur(80px)', animation: 'cta-blob-1 20s ease-in-out infinite' }} />
              <div className="mesh-blob" style={{ position: 'absolute', top: '-10%', right: '-20%', width: '70%', height: '80%', background: 'radial-gradient(circle, rgba(239, 204, 255, 0.8) 0%, rgba(239, 204, 255, 0) 70%)', borderRadius: '50%', filter: 'blur(80px)', animation: 'cta-blob-2 25s ease-in-out infinite', animationDelay: '5s' }} />
              <div className="mesh-blob" style={{ position: 'absolute', bottom: '-30%', left: '-10%', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(193, 232, 255, 0.8) 0%, rgba(193, 232, 255, 0) 70%)', borderRadius: '50%', filter: 'blur(80px)', animation: 'cta-blob-3 22s ease-in-out infinite', animationDelay: '2s' }} />
              <div className="mesh-blob" style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'cta-blob-1 28s ease-in-out infinite reverse' }} />
            </div>

            {/* Foreground Content */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0' }}>
                  Want to report an issue?
                </h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#6b7280', margin: 0, maxWidth: '400px' }}>
                  Join JanKalyan to file complaints, track progress, and upvote issues in your community.
                </p>
              </div>
              
              <Link 
                to="/register" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#111827',
                  color: '#ffffff',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  padding: '12px 28px',
                  borderRadius: '99px',
                  textDecoration: 'none',
                  transition: 'transform 0.2s, opacity 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.opacity = '1'; }}
              >
                <PenLine size={18} />
                Sign up to report
              </Link>
              
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Already have an account? <Link to="/login" style={{ color: '#111827', fontWeight: 600, textDecoration: 'underline' }}>Log in</Link>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PublicComplaintsPage;
