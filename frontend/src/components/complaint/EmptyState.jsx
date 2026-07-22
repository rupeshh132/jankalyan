import React from 'react';
import { SearchX } from 'lucide-react';
import { motion } from 'framer-motion';
import './complaint.css';

const EmptyState = ({ title = "No complaints found", message = "We couldn't find any complaints matching your current filters. Try adjusting your search criteria." }) => {
  return (
    <motion.div 
      className="premium-empty-state"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="empty-icon-wrapper">
        <SearchX size={48} className="empty-state-icon" />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
    </motion.div>
  );
};

export default EmptyState;
