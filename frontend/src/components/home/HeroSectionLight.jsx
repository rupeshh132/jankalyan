import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HeroSectionLight = () => {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        overflow: "hidden",
        paddingBottom: "100px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/hero-sky.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.92) 75%, #ffffff 100%)",
          zIndex: 1,
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          maxWidth: "720px",
          padding: "0 24px",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#2563eb",
            marginBottom: "20px",
          }}
        >
          Civic Infrastructure &bull; India
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(38px, 6vw, 58px)",
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "#0f172a",
            marginBottom: "24px",
          }}
        >
          Report Issues.
          <br />
          Build Better Cities.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: 1.65,
            color: "#64748b",
            maxWidth: "520px",
            margin: "0 auto 40px",
          }}
        >
          JanKalyan connects you directly with local authorities to track,
          update, and fix neighborhood issues — transparently.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
        >
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              to="/dashboard/report"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#0f172a",
                color: "#ffffff",
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: "999px",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(15,23,42,0.25)",
              }}
            >
              Report an Issue <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              to="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.8)",
                color: "#0f172a",
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: "999px",
                textDecoration: "none",
                border: "1px solid rgba(15,23,42,0.12)",
                backdropFilter: "blur(8px)",
              }}
            >
              Explore Reports
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSectionLight;
