import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import NotificationBell from '../layout/NotificationBell';
import { Button } from '../ui/button';
import { throttle } from '../../utils/throttle';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon } from 'lucide-react';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, loading, logout } = useAuth();
  const { data: profileData } = useProfile();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const profile = profileData?.data || {};

  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrolled(window.scrollY > 20);
    }, 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path) || location.hash === path;
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-500 ease-in-out ${
        scrolled ? 'bg-background/80 backdrop-blur-xl border-b shadow-md' : 'bg-background border-b border-transparent'
      }`}
    >
      <div className={`container mx-auto px-4 md:px-6 flex items-center justify-between transition-all duration-500 ease-in-out ${scrolled ? 'h-14' : 'h-20'}`}>
        <div className="flex items-center gap-4">

          
          <Link to="/" className="flex items-center gap-2 group">
            <ShieldCheck className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-bold tracking-tight text-lg hidden sm:inline-block">JanKalyan</span>
          </Link>
        </div>
        
        {!user && (
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/features" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/features') ? 'text-primary' : 'text-muted-foreground'}`}>Features</Link>
            <a href="/#dashboard" className={`text-sm font-medium transition-colors hover:text-primary focus:outline-none ${isActive('#dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>Dashboard</a>
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-4">
          {loading ? (
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          ) : user ? (
            <>
              <NotificationBell />
              <Button onClick={logout} variant="outline" size="sm" className="hidden sm:inline-flex">Logout</Button>
              <Link to="/dashboard/profile" className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="h-4 w-4 text-primary" />
                )}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
