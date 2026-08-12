import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const MissionBand = () => (
  <section
    style={{
      background: "#0f172a",
      padding: "0",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        minHeight: "480px",
      }}
    >
      {/* Text Side */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          padding: "80px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#64748b",
            marginBottom: "24px",
          }}
        >
          Our Mission
        </p>
        <blockquote
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(22px, 3vw, 32px)",
            fontWeight: 600,
            lineHeight: 1.3,
            color: "#ffffff",
            margin: "0 0 24px",
            letterSpacing: "-0.01em",
          }}
        >
          "Every pothole matters.<br />
          Every complaint deserves<br />a response."
        </blockquote>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: 1.7,
            color: "#94a3b8",
            marginBottom: "32px",
            maxWidth: "400px",
          }}
        >
          We believe transparent governance starts with listening to citizens.
          JanKalyan is built to close the gap between reports and resolutions.
        </p>
        <a
          href="/about"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            color: "#ffffff",
            textDecoration: "none",
            opacity: 0.8,
          }}
        >
          Read our story <ArrowRight size={15} />
        </a>
      </motion.div>

      {/* Photo Side */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{
          position: "relative",
          minHeight: "400px",
        }}
      >
        <img
          src="/mission-band.jpg"
          alt="Community working together"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            borderTopLeftRadius: "16px",
            borderBottomLeftRadius: "16px",
          }}
        />
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(15,23,42,0.3)",
            borderTopLeftRadius: "16px",
            borderBottomLeftRadius: "16px",
          }}
        />
      </motion.div>
    </div>
  </section>
);

export default MissionBand;
