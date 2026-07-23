import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../layout/NotificationBell';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
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
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-md border-b shadow-sm' : 'bg-background border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {user && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={toggleSidebar}
              aria-label="Toggle Menu"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
          
          <Link to="/" className="flex items-center gap-2 group">
            <ShieldCheck className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-bold tracking-tight text-lg hidden sm:inline-block">JanKalyan</span>
          </Link>
        </div>
        
        {!user && (
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('#features') ? 'text-primary' : 'text-muted-foreground'}`}>Features</a>
            <a href="#dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('#dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>Dashboard</a>
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <NotificationBell />
              <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="hidden sm:block">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button onClick={logout} variant="outline" size="sm" className="hidden sm:inline-flex">Logout</Button>
              {/* Mobile logout inside sidebar or here. For now, keep it available */}
              <Button onClick={logout} variant="ghost" size="icon" className="sm:hidden" aria-label="Logout">
                <X className="h-4 w-4" />
              </Button>
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
