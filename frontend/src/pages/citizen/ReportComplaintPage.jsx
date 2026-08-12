import React from 'react';
import ComplaintForm from '../../components/complaint/ComplaintForm';
import '../../components/complaint/complaint.css';

const ReportComplaintPage = () => {
  return (
    <div className="page-container max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="page-header">
        <h1 className="page-title">Report New Issue</h1>
      </div>
      <ComplaintForm />
    </div>
  );
};

export default ReportComplaintPage;
