import React, { useState, useEffect } from 'react';
import { X, Landmark, ShieldCheck, User, PenSquare, Monitor, ThumbsUp, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';

const STORAGE_KEY = 'jankalyan_welcome_seen';

const WelcomeSplash = () => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Show only once per session
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }, 400); // match animation duration
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!closing && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-lg bg-card text-card-foreground shadow-2xl rounded-2xl border border-border overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <X size={20} />
            </button>

            <div className="p-6 sm:p-8">
              {/* Header section */}
              <div className="flex flex-col items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary relative">
                  <Landmark size={28} strokeWidth={1.5} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>
                </div>
                
                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                  <ShieldCheck size={14} />
                  <span>Official Platform</span>
                </div>
              </div>

              {/* Title & Intro */}
              <h1 className="text-3xl font-extrabold tracking-tight mb-3">
                Welcome to <span className="text-primary">JanKalyan</span>
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                Namaste! I'm <strong className="text-foreground">Rupesh Vishwakarma</strong>, the creator of this platform. JanKalyan is a small step towards better and cleaner cities. 🙏
              </p>

              {/* Steps Divider */}
              <div className="relative flex items-center mb-6">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  How to use JanKalyan
                </span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              {/* Steps */}
              <div className="space-y-5 mb-8">
                {/* Step 1 */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Create Account</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Sign up or login to your account.</p>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <PenSquare size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Report an Issue</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Click on "Report an Issue" and share the problem with a photo and details.</p>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Monitor size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Track Status</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Check real-time updates on your complaint in the dashboard.</p>
                  </div>
                </div>
                {/* Step 4 */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <ThumbsUp size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Upvote & Support</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Upvote important issues and help your city get better faster.</p>
                  </div>
                </div>
              </div>

              {/* CTA & Footer */}
              <div className="flex flex-col gap-4 items-center mt-8">
                <Button onClick={handleClose} className="w-full text-base py-6 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-md hover:shadow-lg">
                  <Rocket size={18} />
                  Explore JanKalyan
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  <span className="text-red-500">❤️</span> Thank you for being part of this journey.<br/>
                  Together, we can make a difference.
                </p>
              </div>
              
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeSplash;
