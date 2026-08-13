import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const words = ["pothole", "broken streetlight", "clogged drain", "uncollected garbage"];

const MissionBand = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        padding: "0",
        overflow: "hidden",
        backgroundImage: `url('/mission-band.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.8) 40%, rgba(15,23,42,0.3) 100%)",
          zIndex: 1,
        }}
      />
      
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          minHeight: "480px",
          position: "relative",
          zIndex: 2,
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
            maxWidth: "700px",
          }}
        >
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#94a3b8",
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
              lineHeight: 1.4,
              color: "#ffffff",
              margin: "0 0 24px",
              letterSpacing: "-0.01em",
            }}
          >
            <div style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span>"Every</span>
              <span style={{ position: "relative", display: "inline-flex", alignItems: "center", color: "#38bdf8" }}>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {words[index]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span>matters.</span>
            </div>
            <br />
            Every complaint deserves a response."
          </blockquote>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "#cbd5e1",
              marginBottom: "32px",
              maxWidth: "450px",
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
              opacity: 0.9,
              width: "fit-content",
            }}
          >
            Read our story <ArrowRight size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionBand;

