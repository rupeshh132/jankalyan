import React from "react";
import { Building2, Shield, MapPin, Users, Landmark } from "lucide-react";

const logos = [
  { icon: Building2, label: "Municipal Corp" },
  { icon: Shield, label: "Govt of India" },
  { icon: MapPin, label: "Smart Cities" },
  { icon: Users, label: "Citizens First" },
  { icon: Landmark, label: "Panchayati Raj" },
];

const TrustedByBar = () => (
  <div
    style={{
      background: "#f8fafc",
      borderTop: "1px solid #e2e8f0",
      borderBottom: "1px solid #e2e8f0",
      padding: "40px 24px",
      textAlign: "center",
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
        marginBottom: "28px",
      }}
    >
      Trusted by Local Governments &amp; Communities
    </p>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "clamp(32px, 5vw, 72px)",
        flexWrap: "wrap",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {logos.map(({ icon: Icon, label }) => (
        <div
          key={label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            opacity: 0.35,
            filter: "grayscale(100%)",
          }}
        >
          <Icon size={28} color="#0f172a" strokeWidth={1.5} />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              color: "#0f172a",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default TrustedByBar;
