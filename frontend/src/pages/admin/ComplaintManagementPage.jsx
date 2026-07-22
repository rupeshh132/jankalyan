import React, { useState } from 'react';
import { useAdminComplaints } from '../../hooks/useAdminComplaints';
import ComplaintTable from '../../components/admin/ComplaintTable';
import AdminLoadingSkeleton from '../../components/admin/AdminLoadingSkeleton';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import '../../components/complaint/complaint.css';

const ComplaintManagementPage = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, error } = useAdminComplaints(page, 10);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Complaint Management</h1>
      </div>

      {isLoading ? (
        <AdminLoadingSkeleton type="table" />
      ) : isError ? (
        <div className="auth-error">Error loading complaints: {error.message}</div>
      ) : !data?.data?.content?.length ? (
        <AdminEmptyState message="No complaints found in the system." />
      ) : (
        <ComplaintTable data={data} onPageChange={setPage} />
      )}
    </div>
  );
};

export default ComplaintManagementPage;
