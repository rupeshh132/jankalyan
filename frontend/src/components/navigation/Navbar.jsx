import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path) || location.hash === path;
  };

  return (
    <div className="navbar-wrapper">
      <nav className={`navbar-container ${scrolled ? 'navbar-scrolled' : ''}`}>
        <Link to="/" className="nav-brand">
          <ShieldCheck size={20} color="var(--accent)" />
          JanKalyan
        </Link>
        
        <div className="nav-links">
          <a href="#features" className={`nav-link ${isActive('#features') ? 'active' : ''}`}>Features</a>
          <a href="#dashboard" className={`nav-link ${isActive('#dashboard') ? 'active' : ''}`}>Dashboard</a>
          <a href="#analytics" className={`nav-link ${isActive('#analytics') ? 'active' : ''}`}>Analytics</a>
        </div>

        <div className="nav-cta-group">
          <Link to="/login" className="btn-ghost">Log in</Link>
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
