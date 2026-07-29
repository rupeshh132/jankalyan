import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, FileQuestion } from 'lucide-react';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({ 
  icon: Icon = Inbox, 
  title = "No data found", 
  description = "There is nothing to display here at the moment.", 
  actionText, 
  actionPath 
}) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] w-full"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150" />
        <div className="relative bg-card border shadow-sm w-20 h-20 rounded-2xl flex items-center justify-center">
          <Icon size={32} className="text-muted-foreground" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold tracking-tight text-foreground mb-2 page-title">
        {title}
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        {description}
      </p>
      
      {actionText && actionPath && (
        <Button onClick={() => navigate(actionPath)} size="lg" className="rounded-full shadow-lg hover:shadow-primary/25 transition-all">
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
