import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Activity, LayoutDashboard, Check, ArrowRight } from "lucide-react";

const features = [
  {
    badge: "Location Tracking",
    badgeColor: "#2563eb",
    badgeBg: "#eff6ff",
    icon: MapPin,
    headline: "Pinpoint exactly where the issue is",
    description:
      "Drop a pin on our high-precision map. City workers get exact coordinates — no confusion, faster repairs.",
    bullets: [
      "Street-level accuracy",
      "Works on mobile & desktop",
      "Auto-populated ward & zone",
    ],
    bulletColor: "#10b981",
    screenshot: "/location-tracking.jpg",
    bg: "#ffffff",
    reverse: false,
  },
  {
    badge: "Real-time Tracking",
    badgeColor: "#059669",
    badgeBg: "#ecfdf5",
    icon: Activity,
    headline: "Follow your report from submission to resolution",
    description:
      "Get notified at every step. No more wondering if anyone saw your complaint.",
    bullets: [
      "Live status updates",
      "In-app notifications",
      "Full history & timeline",
    ],
    bulletColor: "#2563eb",
    screenshot: "/real-time-tracking.png",
    bg: "#f8fafc",
    reverse: true,
  },
  {
    badge: "Admin Dashboard",
    badgeColor: "#d97706",
    badgeBg: "#fffbeb",
    icon: LayoutDashboard,
    headline: "Municipalities get a powerful control panel",
    description:
      "Assign issues, track resolution velocity, and report to stakeholders — all from one clean dashboard.",
    bullets: [
      "Full complaint management",
      "Analytics & trend charts",
      "Role-based access control",
    ],
    bulletColor: "#d97706",
    screenshot: "/ss4.png",
    bg: "#ffffff",
    reverse: false,
  },
];

const FeaturesSectionLight = () => (
  <div>
    {features.map((f, idx) => (
      <section
        key={f.badge}
        style={{ background: f.bg, padding: "96px 24px" }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "64px",
            alignItems: "center",
          }}
        >
          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: f.reverse ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ order: f.reverse ? 2 : 1 }}
          >
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: f.badgeBg,
                color: f.badgeColor,
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "6px 12px",
                borderRadius: "999px",
                marginBottom: "20px",
              }}
            >
              <f.icon size={13} />
              {f.badge}
            </div>

            <h3
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(24px, 3vw, 32px)",
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "#0f172a",
                marginBottom: "16px",
              }}
            >
              {f.headline}
            </h3>

            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "17px",
                fontWeight: 400,
                lineHeight: 1.7,
                color: "#64748b",
                marginBottom: "28px",
              }}
            >
              {f.description}
            </p>

            {/* Bullets */}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {f.bullets.map((b) => (
                <li
                  key={b}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#374151",
                  }}
                >
                  <Check size={16} color={f.bulletColor} strokeWidth={2.5} />
                  {b}
                </li>
              ))}
            </ul>

            <Link
              to="/features"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                color: "#2563eb",
                textDecoration: "none",
                borderBottom: "1px solid transparent",
                paddingBottom: "2px",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.borderColor = "#2563eb")}
              onMouseLeave={(e) => (e.target.style.borderColor = "transparent")}
            >
              Learn more <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Screenshot Column */}
          <motion.div
            initial={{ opacity: 0, x: f.reverse ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ order: f.reverse ? 1 : 2 }}
          >
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.06), 0 20px 60px rgba(0,0,0,0.1)",
                border: "1px solid rgba(15,23,42,0.06)",
                background: "#f8fafc",
              }}
            >
              <img
                src={f.screenshot}
                alt={f.badge}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  objectFit: "cover",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    ))}
  </div>
);

export default FeaturesSectionLight;
