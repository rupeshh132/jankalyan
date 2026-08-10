import React, { useState } from 'react';
import { useOutlet, useLocation } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';
import Footer from '../components/navigation/Footer';
import BottomNav from '../components/navigation/BottomNav';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { RadialBackground } from '../components/ui/light-theme-tailwind-css-background-snippet';

const AppLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const outlet = useOutlet();
  const isLandingPage = location.pathname === '/';

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground font-sans antialiased ${isLandingPage ? 'relative overflow-hidden' : ''}`}>
      {isLandingPage && <RadialBackground className="opacity-80" />}
      
      <div className="relative z-10 w-full">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
      </div>
      
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {user && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
        
        <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${user ? 'md:pl-64 pb-16 md:pb-0' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
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
