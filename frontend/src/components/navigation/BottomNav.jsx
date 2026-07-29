import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNavItems } from './navConfig';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import './navigation.css';

const BottomNav = () => {
  const { user } = useAuth();
  if (!user) return null;

  const navItems = getNavItems(user.role).filter(item => !item.hideOnMobile);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-50 px-2 pb-safe-area shadow-lg">
      <nav className="flex justify-between items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    whileTap={{ scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={cn(
                      "flex items-center justify-center rounded-full",
                      item.isMain ? "w-12 h-12 bg-primary text-primary-foreground shadow-md -translate-y-4 border-4 border-background" : "w-8 h-8"
                    )}
                  >
                    <item.icon 
                      size={item.isMain ? 24 : 20} 
                      strokeWidth={isActive && !item.isMain ? 2.5 : 2}
                      className={cn(isActive && !item.isMain ? "fill-primary/20" : "")}
                    />
                  </motion.div>
                  {!item.isMain && (
                    <span className={cn(
                      "text-[10px] font-medium transition-all",
                      isActive ? "font-bold" : ""
                    )}>
                      {item.name}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
