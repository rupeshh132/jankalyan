import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePublicComplaints } from '../../hooks/useComplaints';
import { useDebounce } from '../../hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import ComplaintList from '../../components/complaint/ComplaintList';
import { Search, Filter } from 'lucide-react';
import './public-complaints.css';

const PublicComplaintsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read state from URL params directly (Single Source of Truth)
  const page = parseInt(searchParams.get('page') || '0', 10);
  const sort = searchParams.get('sort') || 'createdAt,desc';
  const categoryId = searchParams.get('categoryId') || '';
  const status = searchParams.get('status') || '';
  const searchParam = searchParams.get('search') || '';

  // Local state for search input to allow debouncing
  const [searchInput, setSearchInput] = useState(searchParam);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Helper to safely update URL parameters
  const updateParams = (updates, replace = false) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      
      Object.keys(updates).forEach(key => {
        const value = updates[key];
        if (value === null || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      // If updating anything other than 'page', reset page to 0
      if (!Object.keys(updates).includes('page')) {
        newParams.set('page', '0');
      }

      return newParams;
    }, { replace });
  };

  // Sync debounced search to URL
  useEffect(() => {
    if (debouncedSearch !== searchParam) {
      updateParams({ search: debouncedSearch || null }, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Sync external URL changes back to search input (e.g. Back/Forward)
  useEffect(() => {
    if (searchParam !== debouncedSearch) {
      setSearchInput(searchParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam]);

  // Fetch data
  const { data, isLoading, isError, error, refetch } = usePublicComplaints({
    page,
    size: 10,
    sort,
    search: debouncedSearch || null,
    categoryId: categoryId || null,
    status: status || null
  });

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
  };

  // Fetch Categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    }
  });
  
  const categories = categoriesData?.data || [];

  return (
    <div className="discovery-container">
      <div className="discovery-header">
        <h1>Public Complaints</h1>
        <p>Discover and track civic issues reported by citizens in your area.</p>
      </div>

      <div className="discovery-layout">
        {/* Filter Sidebar */}
        <aside className="filter-sidebar">
          <div className="filter-card">
            <div className="filter-section">
              <label className="filter-label">Search</label>
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by title, location..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="filter-input search-input"
                />
              </div>
            </div>

            <div className="filter-section">
              <label className="filter-label">Status</label>
              <select 
                value={status} 
                onChange={(e) => updateParams({ status: e.target.value })}
                className="filter-input"
              >
                <option value="">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="filter-section">
              <label className="filter-label">Category</label>
              <select 
                value={categoryId} 
                onChange={(e) => updateParams({ categoryId: e.target.value })}
                className="filter-input"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <label className="filter-label">Sort By</label>
              <select 
                value={sort} 
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="filter-input"
              >
                <option value="createdAt,desc">Newest First</option>
                <option value="createdAt,asc">Oldest First</option>
                <option value="title,asc">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="discovery-main">
          <ComplaintList
            isLoading={isLoading}
            isError={isError}
            error={error}
            data={data}
            onPageChange={handlePageChange}
            refetch={refetch}
          />
        </main>
      </div>
    </div>
  );
};

export default PublicComplaintsPage;
