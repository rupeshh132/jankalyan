import React, { useState, useRef } from "react";
import { usePublicComplaints } from "../../hooks/useComplaints";
import ComplaintList from "../../components/complaint/ComplaintList";
import { useAuth } from "../../context/AuthContext";
import "../../components/complaint/complaint.css";

// Light Editorial Theme components
import HeroSectionLight from "../../components/home/HeroSectionLight";
import TrustedByBar from "../../components/home/TrustedByBar";
import FeaturesSectionLight from "../../components/home/FeaturesSectionLight";
import MissionBand from "../../components/home/MissionBand";
import ClosingCTALight from "../../components/home/ClosingCTALight";
import Footer from "../../components/navigation/Footer";

const HomePage = () => {
  const [page, setPage] = useState(0);
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch } = usePublicComplaints({ page, size: 5 }, user?.id);
  const reportsSectionRef = useRef(null);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setTimeout(() => {
      if (reportsSectionRef.current) {
        reportsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  return (
    <div style={{ overflowX: "hidden" }}>
      <HeroSectionLight />
      <TrustedByBar />
      <FeaturesSectionLight />
      <MissionBand />

      {/* Latest Community Reports */}
      <section ref={reportsSectionRef} style={{ background: "#f8fafc", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563eb", marginBottom: "8px" }}>
              Live Feed
            </p>
            <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#0f172a", margin: 0 }}>
              Latest Community Reports
            </h2>
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
      </section>

      <ClosingCTALight />
      <Footer />
    </div>
  );
};

export default HomePage;
