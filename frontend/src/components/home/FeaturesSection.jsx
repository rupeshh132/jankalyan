import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Activity, ShieldCheck, CheckCircle2, Navigation } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-4 bg-background relative overflow-hidden">
      {/* Decorative background noise for texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">improve your neighborhood</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Report issues, track progress, and hold authorities accountable. A unified platform designed to give citizens a voice and municipalities a clear path to action.
          </p>
        </motion.div>
        
        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          
          {/* Bento Item 1: Large (Spans 2 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="md:col-span-2 md:row-span-2 bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col justify-between overflow-hidden relative group"
          >
            {/* Soft background glow */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-colors duration-500" />
            
            <div className="relative z-10 max-w-md">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Pinpoint exactly where it hurts</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether it's a deep pothole or a broken street light, drop a pin on our high-precision map. City workers get exact coordinates, eliminating confusion and speeding up repairs.
              </p>
            </div>
            
            {/* Visual Element */}
            <div className="relative h-48 mt-8 rounded-xl border border-border/50 bg-background/50 overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              >
                <Navigation size={48} fill="currentColor" className="rotate-45" />
              </motion.div>
            </div>
          </motion.div>
          
          {/* Bento Item 2: Small */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col relative overflow-hidden"
          >
             <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Real-time pulse</h3>
            <p className="text-muted-foreground mb-6">Follow your reports from submission to resolution without guessing.</p>
            
            <div className="mt-auto space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                <CheckCircle2 size={16} className="text-accent" />
                <div className="text-sm font-medium">Issue Assigned</div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50 opacity-50">
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                <div className="text-sm font-medium">Work in Progress</div>
              </div>
            </div>
          </motion.div>
          
          {/* Bento Item 3: Small */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col relative overflow-hidden group"
          >
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-500/20 transition-colors duration-500" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Radical transparency</h3>
              <p className="text-muted-foreground">Hold authorities accountable with open data and public scorecards.</p>
            </div>
            
            <div className="mt-auto flex items-end gap-2 h-24">
              <motion.div initial={{ height: "40%" }} whileInView={{ height: "60%" }} className="w-full bg-emerald-500/20 rounded-t-md" />
              <motion.div initial={{ height: "50%" }} whileInView={{ height: "80%" }} className="w-full bg-emerald-500/40 rounded-t-md" />
              <motion.div initial={{ height: "30%" }} whileInView={{ height: "100%" }} className="w-full bg-emerald-500 rounded-t-md" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
