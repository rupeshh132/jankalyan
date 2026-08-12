import React, { useState } from "react";
import { useOutlet, useLocation } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import Sidebar from "../components/navigation/Sidebar";
import Footer from "../components/navigation/Footer";
import BottomNav from "../components/navigation/BottomNav";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const AppLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const outlet = useOutlet();
  const isLandingPage = location.pathname === "/";
  const isAuthPage = location.pathname === "/register" || location.pathname === "/login";
  const isPublicFeaturePage = location.pathname === "/features" || location.pathname === "/complaints";
  const showSharedFooter = !user && !isLandingPage && !isAuthPage && !isPublicFeaturePage;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">

      {/* 
        Landing page: Navbar is absolute (overlays hero photo).
        All other pages: Navbar is sticky so it stays in normal flow
        and content naturally starts below it — no padding-top hack needed.
      */}
      {isLandingPage ? (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50 }}>
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        </div>
      ) : (
        <div className="sticky top-0 z-50 w-full">
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        </div>
      )}

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {user && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}

        <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${user ? "md:pl-64 pb-16 md:pb-0" : ""}`}>
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
          {showSharedFooter && <Footer />}
        </main>
      </div>

      {user && <BottomNav />}
    </div>
  );
};

export default AppLayout;
