import React, { useState } from 'react';
import { usePublicComplaints } from '../../hooks/useComplaints';
import ComplaintList from '../../components/complaint/ComplaintList';
import { Link } from 'react-router-dom';
import '../../components/complaint/complaint.css';


const DashboardPage = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, error, refetch } = usePublicComplaints(page, 10);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Public Feed</h1>
        <Link to="/dashboard/report" className="auth-button" style={{ width: 'auto', marginTop: 0 }}>
          Report Issue
        </Link>
      </div>
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
