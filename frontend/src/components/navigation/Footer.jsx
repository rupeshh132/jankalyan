import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const footerCols = [
  {
    heading: "Platform",
    links: [
      { label: "How It Works", to: "/how-it-works" },
      { label: "Features", to: "/features" },
      { label: "Public Board", to: "/complaints" },
      { label: "Report Issue", to: "/dashboard/report" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Help Center", to: "/help" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms & Conditions", to: "#" },
      { label: "Privacy Policy", to: "#" },
    ],
  },
];

const Footer = () => {
  return (
    <footer style={{
      background: "#111827",
      padding: "64px 24px 40px",
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        {/* Top row — Brand + nav columns */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "48px",
          justifyContent: "space-between",
          paddingBottom: "48px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>

          {/* Brand block */}
          <div style={{ maxWidth: "320px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <ShieldCheck size={22} style={{ color: "#2563eb" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em" }}>
                JanKalyan
              </span>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>
              Empowering citizens to report, track, and resolve civic issues — transparently and collectively.
            </p>
          </div>

          {/* Nav link columns */}
          <div style={{ display: "flex", gap: "60px", flexWrap: "wrap" }}>
            {footerCols.map((col) => (
              <div key={col.heading}>
                <h4 style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "16px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  margin: "0 0 16px 0",
                }}>
                  {col.heading}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          color: "rgba(255,255,255,0.55)",
                          textDecoration: "none",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                        onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.55)")}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row — copyright */}
        <div style={{
          paddingTop: "32px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: 0 }}>
            © {new Date().getFullYear()} JanKalyan. All rights reserved.
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.25)", margin: 0 }}>
            Civic Platform v2.0
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

