import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ClosingCTALight = () => (
  <section
    style={{
      position: "relative",
      padding: "120px 24px",
      textAlign: "center",
      overflow: "hidden",
    }}
  >
    {/* Photo background */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url(/cta-closing.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 0,
      }}
    />
    {/* White overlay */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(248,250,252,0.92) 100%)",
        zIndex: 1,
      }}
    />

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "relative", zIndex: 2 }}
    >
      <h2
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: "#0f172a",
          marginBottom: "20px",
        }}
      >
        Ready to improve your city?
      </h2>
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "18px",
          fontWeight: 400,
          color: "#64748b",
          marginBottom: "40px",
          maxWidth: "500px",
          margin: "0 auto 40px",
          lineHeight: 1.65,
        }}
      >
        Join thousands of citizens making their neighborhoods better — one
        report at a time.
      </p>
      <motion.div
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        style={{ display: "inline-block" }}
      >
        <Link
          to="/dashboard/report"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#2563eb",
            color: "#ffffff",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            padding: "16px 36px",
            borderRadius: "999px",
            textDecoration: "none",
            boxShadow: "0 8px 24px rgba(37,99,235,0.35)",
          }}
        >
          Start Reporting <ArrowRight size={18} />
        </Link>
      </motion.div>
    </motion.div>
  </section>
);

export default ClosingCTALight;
