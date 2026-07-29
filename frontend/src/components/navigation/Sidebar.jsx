import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, AlertCircle, FileText, Settings, User, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import { getNavItems } from './navConfig';

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
                  "mr-3 h-5 w-5 flex-shrink-0 transition-all duration-200 group-hover:translate-x-1",
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
      {/* Desktop Sidebar ONLY. Mobile uses BottomNav */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16 z-30">
        <SidebarContent navItems={navItems} />
      </div>
    </>
  );
};

export default Sidebar;
