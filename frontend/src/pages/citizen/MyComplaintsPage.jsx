import React, { useState } from 'react';
import { useMyComplaints } from '../../hooks/useComplaints';
import ComplaintList from '../../components/complaint/ComplaintList';
import { Link } from 'react-router-dom';
import '../../components/complaint/complaint.css';


const MyComplaintsPage = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, error, refetch } = useMyComplaints(page, 10);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Complaints</h1>
        <Link to="/dashboard/report" className="auth-button" style={{ width: 'auto', marginTop: 0 }}>
          New Complaint
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

export default MyComplaintsPage;
