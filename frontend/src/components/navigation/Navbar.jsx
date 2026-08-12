import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../hooks/useProfile";
import NotificationBell from "../layout/NotificationBell";
import { Button } from "../ui/button";
import { throttle } from "../../utils/throttle";
import { User as UserIcon } from "lucide-react";
import { getNavItems } from "./navConfig";
import { cn } from "../../lib/utils";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, loading, logout } = useAuth();
  const { data: profileData } = useProfile();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const drawerRef = useRef(null);
  const profile = profileData?.data || {};

  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrolled(window.scrollY > 40);
    }, 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (mobileOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [mobileOpen]);

  const isLandingPage = location.pathname === "/";
  const isHeroNav = isLandingPage && !scrolled;

  const headerStyle = {
    position: isLandingPage ? "fixed" : "sticky",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    width: "100%",
    transition: "background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease",
    background: isHeroNav
      ? "transparent"
      : "rgba(244, 243, 237, 0.65)",
    backdropFilter: isHeroNav ? "none" : "blur(16px)",
    WebkitBackdropFilter: isHeroNav ? "none" : "blur(16px)",
    borderBottom: isHeroNav ? "none" : "1px solid rgba(0,0,0,0.05)",
    boxShadow: (scrolled && !isHeroNav) ? "0 4px 20px rgba(0, 0, 0, 0.03)" : "none",
  };

  const textColor = isHeroNav ? "rgba(255,255,255,0.92)" : "#64748b";
  const navItems = user ? getNavItems(user.role) : [];

  return (
    <>
      <header style={headerStyle}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}>

          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <ShieldCheck size={22} style={{ color: isHeroNav ? "#ffffff" : "#2563eb", transition: "color 0.3s" }} />
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "17px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: isHeroNav ? "#ffffff" : "#0f172a",
              transition: "color 0.3s",
            }}>JanKalyan</span>
          </Link>

          {/* Desktop Nav links (public) */}
          {!user && (
            <nav style={{ display: "flex", alignItems: "center", gap: "32px" }} className="hidden sm:flex">
              {[{ label: "Features", to: "/features" }, { label: "Reports", to: "/complaints" }].map(({ label, to }) => (
                <Link key={label} to={to} style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: textColor,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >{label}</Link>
              ))}
            </nav>
          )}

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {loading ? (
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #2563eb", borderTopColor: "transparent" }} />
            ) : user ? (
              <>
                <NotificationBell />
                <Button onClick={logout} variant="outline" size="sm" className="hidden sm:inline-flex">Logout</Button>
                <Link to="/dashboard/profile" style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", textDecoration: "none",
                }}>
                  {profile.profileImage
                    ? <img src={profile.profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <UserIcon size={16} style={{ color: "#2563eb" }} />}
                </Link>
                {/* Mobile hamburger — only for logged-in users */}
                <button
                  onClick={() => setMobileOpen(true)}
                  className="md:hidden"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "36px", height: "36px", borderRadius: "8px",
                    background: "transparent", border: "1px solid #e2e8f0", cursor: "pointer",
                    color: "#374151",
                  }}
                  aria-label="Open navigation menu"
                >
                  <Menu size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500,
                  color: isHeroNav ? "rgba(255,255,255,0.92)" : "#0f172a",
                  textDecoration: "none", padding: "8px 14px", transition: "opacity 0.2s",
                }}>Log in</Link>
                <Link to="/register"
                  style={{
                    fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600,
                    color: "#ffffff",
                    background: "#111827",
                    textDecoration: "none", padding: "9px 20px", borderRadius: "8px",
                    transition: "background 0.5s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
                  onMouseLeave={e => e.currentTarget.style.background = "#111827"}
                >Get Started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(2px)",
            transition: "opacity 0.2s ease",
          }}
        >
          {/* Drawer Panel */}
          <div
            ref={drawerRef}
            style={{
              position: "absolute", top: 0, right: 0,
              width: "280px", height: "100%",
              background: "#ffffff",
              borderLeft: "1px solid #e2e8f0",
              display: "flex", flexDirection: "column",
              boxShadow: "-8px 0 32px rgba(0,0,0,0.08)",
            }}
          >
            {/* Drawer header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px", borderBottom: "1px solid #f1f5f9",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={20} style={{ color: "#2563eb" }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
                  JanKalyan
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "32px", height: "32px", borderRadius: "8px",
                  background: "transparent", border: "none", cursor: "pointer", color: "#6b7280",
                }}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav items */}
            <nav style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/dashboard' && item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    style={{ textDecoration: "none" }}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-3 transition-all duration-200",
                      isActive ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: "32px", height: "32px", borderRadius: "8px", marginRight: "12px",
                      background: isActive ? "#dbeafe" : "transparent",
                      color: isActive ? "#2563eb" : "#64748b",
                    }}>
                      <item.icon size={18} />
                    </div>
                    <span style={{
                      fontFamily: "Inter, sans-serif", fontSize: "15px",
                      fontWeight: isActive ? 600 : 500,
                    }}>
                      {item.name}
                    </span>
                    {isActive && (
                      <div style={{ width: "3px", height: "16px", background: "#2563eb", borderRadius: "4px", marginLeft: "auto" }} />
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Drawer footer */}
            <div style={{ padding: "20px 24px", borderTop: "1px solid #f1f5f9" }}>
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#111827", color: "#ffffff",
                  fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600,
                  padding: "10px 0", borderRadius: "8px", border: "none", cursor: "pointer",
                  transition: "background 0.5s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#2563eb"}
                onMouseLeave={e => e.currentTarget.style.background = "#111827"}
              >
                Log Out
              </button>
              <p style={{ textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#94a3b8", marginTop: "12px", marginBottom: 0 }}>
                Civic Platform v2.0
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
