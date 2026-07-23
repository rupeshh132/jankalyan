import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, AlertCircle, FileText, Settings, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const getNavItems = (role) => {
  if (role === 'ADMIN') {
    return [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'All Complaints', path: '/admin/complaints', icon: FileText },
      { name: 'Notifications', path: '/notifications', icon: AlertCircle },
    ];
  }
  return [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Complaints', path: '/dashboard/complaints', icon: FileText },
    { name: 'Notifications', path: '/notifications', icon: AlertCircle },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];
};

const SidebarContent = ({ navItems, closeMobile }) => {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-card py-6 border-r">
      <div className="px-6 mb-8 hidden md:block">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Menu</h2>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobile}
              className={cn(
                "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                )}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const navItems = getNavItems(user.role);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16 z-30">
        <SidebarContent navItems={navItems} />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] bg-card shadow-xl md:hidden pt-16"
            >
              <SidebarContent navItems={navItems} closeMobile={() => setIsOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
