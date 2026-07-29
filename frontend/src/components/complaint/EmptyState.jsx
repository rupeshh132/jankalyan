import React from 'react';
import { SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({ title = "No complaints found", message = "We couldn't find any complaints matching your current filters. Try adjusting your search criteria." }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-12 text-center bg-card/50 backdrop-blur-sm border border-dashed rounded-xl shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <SearchX size={36} className="text-primary opacity-80" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">{message}</p>
    </motion.div>
  );
};

export default EmptyState;
