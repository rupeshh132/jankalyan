import React from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="app-layout">
      {/* Header Placeholder */}
      <header>App Header</header>
      <main>
        <Outlet />
      </main>
      {/* Footer Placeholder */}
      <footer>App Footer</footer>
    </div>
  );
};

export default AppLayout;
