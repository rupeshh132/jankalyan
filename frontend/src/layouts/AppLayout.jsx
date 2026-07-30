import React, { useState } from 'react';
import { useOutlet, useLocation } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';
import Footer from '../components/navigation/Footer';
import BottomNav from '../components/navigation/BottomNav';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AppLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        {user && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
        
        <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${user ? 'md:pl-64 pb-16 md:pb-0' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 w-full"
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
          {!user && <Footer />}
        </main>
      </div>
      {user && <BottomNav />}
    </div>
  );
};

export default AppLayout;
