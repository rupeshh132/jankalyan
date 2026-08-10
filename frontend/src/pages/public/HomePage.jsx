import React, { useState, useRef } from 'react';
import { usePublicComplaints } from '../../hooks/useComplaints';
import ComplaintList from '../../components/complaint/ComplaintList';
import HeroSection from '../../components/home/HeroSection';
import { ScrollShowcase } from '../../components/ui/text-scroll-animation';
import FeaturesSection from '../../components/home/FeaturesSection';
import '../../components/complaint/complaint.css';
import { useAuth } from '../../context/AuthContext';

const HomePage = () => {
  const [page, setPage] = useState(0);
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch } = usePublicComplaints({ page, size: 5 }, user?.id);
  
  const reportsSectionRef = useRef(null);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Add a slight delay to allow the DOM to render the new complaints before scrolling
    setTimeout(() => {
      if (reportsSectionRef.current) {
        reportsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <div className="page-container relative z-20">
      
      <HeroSection />
      
      <ScrollShowcase />
      
      <FeaturesSection />

      {/* Latest Complaints (Untouched below Hero) */}
      <div ref={reportsSectionRef} style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="page-title" style={{ fontSize: '1.8rem', margin: 0 }}>Latest Community Reports</h2>
        </div>
        
        <ComplaintList 
          data={data} 
          isLoading={isLoading} 
          isError={isError} 
          error={error} 
          onPageChange={handlePageChange} 
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default HomePage;
