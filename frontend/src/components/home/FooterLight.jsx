import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const footerCols = [
  {
    heading: "Product",
    links: [
      { label: "Features", to: "/#features" },
      { label: "Complaint Reports", to: "/dashboard" },
      { label: "Admin Dashboard", to: "/admin/dashboard" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/" },
      { label: "Blog", to: "/" },
      { label: "Careers", to: "/" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Help Center", to: "/" },
      { label: "Community", to: "/" },
      { label: "Status", to: "/" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", to: "/" },
      { label: "Terms of Service", to: "/" },
      { label: "Cookie Policy", to: "/" },
    ],
  },
];

const FooterLight = () => (
  <footer style={{ background: "#0f172a", position: "relative", overflow: "hidden" }}>
    {/* Faint wordmark watermark */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: "-40px",
        left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "Inter, sans-serif",
        fontSize: "clamp(80px, 15vw, 160px)",
        fontWeight: 700,
        color: "rgba(255,255,255,0.04)",
        letterSpacing: "-0.04em",
        whiteSpace: "nowrap",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      JANKALYAN
    </div>

    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 24px 40px" }}>
      {/* Top row: logo + columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "48px",
          marginBottom: "64px",
        }}
      >
        {/* Logo col */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <Shield size={20} color="#2563eb" />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              JanKalyan
            </span>
          </div>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#64748b",
              lineHeight: 1.6,
              maxWidth: "200px",
            }}
          >
            Connecting citizens with local government, one report at a time.
          </p>
        </div>

        {/* Link columns */}
        {footerCols.map((col) => (
          <div key={col.heading}>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: "16px",
                letterSpacing: "0.02em",
              }}
            >
              {col.heading}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "#64748b",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#94a3b8")}
                    onMouseLeave={(e) => (e.target.style.color = "#64748b")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom strip */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            color: "#475569",
          }}
        >
          &copy; 2026 JanKalyan. All rights reserved.
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            color: "#334155",
          }}
        >
          Made with ❤️ for Indian citizens
        </p>
      </div>
    </div>
  </footer>
);

export default FooterLight;
