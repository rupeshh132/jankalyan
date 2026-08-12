import React, { useState } from 'react';
import { Bell, Lock, Trash2, Eye, Smartphone, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  const { logout } = useAuth();
  const [hoveredRow, setHoveredRow] = useState(null);

  const settingsSections = [
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage how you receive alerts and updates',
      icon: Bell,
    },
    {
      id: 'security',
      title: 'Security & Password',
      description: 'Update your password and secure your account',
      icon: Lock,
    },
    {
      id: 'privacy',
      title: 'Privacy',
      description: 'Control what information is visible to the public',
      icon: Eye,
    },
    {
      id: 'devices',
      title: 'Connected Devices',
      description: 'Manage active sessions across devices',
      icon: Smartphone,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
          Settings
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6b7280', margin: 0 }}>
          Manage your account preferences and settings.
        </p>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
        {settingsSections.map((section, index) => {
          const isHovered = hoveredRow === section.id;
          return (
            <div 
              key={section.id} 
              onMouseEnter={() => setHoveredRow(section.id)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '24px 32px',
                borderBottom: index < settingsSections.length - 1 ? '1px solid #e2e8f0' : 'none',
                cursor: 'pointer',
                background: isHovered ? '#FAFAFF' : 'transparent',
                transition: 'background 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <section.icon size={22} style={{ color: isHovered ? '#111827' : '#6b7280', transition: 'color 0.2s ease' }} />
                <div>
                  <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 4px 0' }}>{section.title}</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6b7280', margin: 0 }}>{section.description}</p>
                </div>
              </div>
              <ChevronRight size={20} style={{ color: isHovered ? '#111827' : '#9ca3af', transition: 'color 0.2s ease' }} />
            </div>
          );
        })}
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}>
        <div>
          <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0' }}>Sign Out</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>Securely log out of this browser session.</p>
          <button 
            onClick={logout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#111827',
              color: '#ffffff',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              padding: '0 32px',
              height: '40px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.5s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
            onMouseLeave={e => e.currentTarget.style.background = '#111827'}
          >
            <LogOut size={16} style={{ marginRight: '8px' }} />
            Log Out
          </button>
        </div>
      </div>

      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '16px', padding: '32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 600, color: '#991B1B', margin: '0 0 8px 0' }}>Danger Zone</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#B91C1C', margin: '0 0 24px 0' }}>Permanently delete your account and all data. This action cannot be undone.</p>
          <button 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              color: '#DC2626',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              padding: '0 32px',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid #DC2626',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#FEF2F2';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Trash2 size={16} style={{ marginRight: '8px' }} />
            Delete Account
          </button>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '16px' }}>
        <Link to="/help" style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.color = '#111827'} onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
          <HelpCircle size={14} style={{ marginRight: '6px' }} />
          Need help? Visit our Help Center
        </Link>
      </div>
    </div>
  );
};

export default SettingsPage;
