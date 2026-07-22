import React from 'react';
import ComplaintForm from '../../components/complaint/ComplaintForm';
import '../../components/complaint/complaint.css';

const ReportComplaintPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Report New Issue</h1>
      </div>
      <ComplaintForm />
    </div>
  );
};

export default ReportComplaintPage;
