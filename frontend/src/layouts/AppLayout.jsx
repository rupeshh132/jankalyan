import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
      {/* Footer Placeholder */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>App Footer</footer>
    </div>
  );
};

export default AppLayout;
