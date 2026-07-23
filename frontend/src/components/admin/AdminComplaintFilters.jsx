import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import '../complaint/complaint.css';
import './admin.css';

const AdminComplaintFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  categoryId, 
  setCategoryId, 
  status, 
  setStatus,
  sort,
  setSort
}) => {
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  return (
    <div className="filters-container admin-filters">
      <div className="search-box">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Search by title, name, email, or address..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-dropdowns">
        <div className="filter-group">
          <Filter className="filter-icon" size={16} />
          <select 
            value={categoryId} 
            onChange={(e) => setCategoryId(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <Filter className="filter-icon" size={16} />
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
        <div className="filter-group">
          <Filter className="filter-icon" size={16} />
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="filter-select"
          >
            <option value="createdAt,desc">Newest First</option>
            <option value="createdAt,asc">Oldest First</option>
            <option value="status,asc">Status</option>
            <option value="category.name,asc">Category</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintFilters;
