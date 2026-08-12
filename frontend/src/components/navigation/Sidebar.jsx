import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getNavItems } from './navConfig';

const SidebarContent = ({ navItems, closeMobile }) => {
  const location = useLocation();

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: '#ffffff', borderRight: '1px solid #e2e8f0', padding: '1.5rem 0'
    }}>
      <nav style={{ flex: 1, padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobile}
              style={{ textDecoration: 'none' }}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2.5 transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '8px', marginRight: '12px',
                background: isActive ? '#dbeafe' : 'transparent',
                color: isActive ? '#2563eb' : '#64748b',
                transition: 'all 0.2s ease'
              }} className={!isActive ? "group-hover:bg-slate-100 group-hover:color-slate-900" : ""}>
                <item.icon size={18} />
              </div>
              <span style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.925rem',
                fontWeight: isActive ? 600 : 500, letterSpacing: '-0.01em'
              }}>
                {item.name}
              </span>
              {isActive && (
                <div style={{ width: '3px', height: '16px', background: '#2563eb', borderRadius: '4px', marginLeft: 'auto' }} />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Subtle footer inside sidebar */}
      <div style={{ padding: '1.5rem', marginTop: 'auto', borderTop: '1px solid #f1f5f9' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#94a3b8', margin: 0, textAlign: 'center' }}>
          Civic Platform v2.0
        </p>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  if (!user) return null;
  const navItems = getNavItems(user.role);

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40">
      <div style={{ marginTop: '64px', height: 'calc(100vh - 64px)' }}>
        <SidebarContent navItems={navItems} />
      </div>
    </div>
  );
};

export default Sidebar;
