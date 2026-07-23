import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Activity, Users, ShieldCheck, Database, LayoutDashboard, MessageSquare, Bell } from 'lucide-react';

const FeaturesPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "tween", ease: "easeOut", duration: 0.4 }
    }
  };

  const features = [
    {
      title: "Geolocated Incident Reporting",
      description: "Pinpoint exact locations on a digital map. Citizens can provide precise coordinates so municipal workers know exactly where to dispatch resources, saving valuable time and effort.",
      icon: <MapPin size={28} />,
      color: "var(--primary)"
    },
    {
      title: "Real-Time Tracking & Transparency",
      description: "No more black holes for complaints. Track the real-time status of your report from 'Pending' to 'In Progress' to 'Resolved' with timestamps and official remarks.",
      icon: <Activity size={28} />,
      color: "var(--warning-text)"
    },
    {
      title: "Community Upvoting",
      description: "Democratize city planning. If someone else has already reported a pothole, just upvote it! High-vote issues are automatically prioritized on the admin dashboard.",
      icon: <Users size={28} />,
      color: "var(--success-text)"
    },
    {
      title: "Role-Based Access Control",
      description: "Secure separation of concerns. Citizens have dedicated portals to manage their reports, while Admins get powerful tools to update statuses and categorize issues seamlessly.",
      icon: <ShieldCheck size={28} />,
      color: "var(--accent)"
    },
    {
      title: "Rich Media Attachments",
      description: "A picture is worth a thousand words. Users can attach high-resolution images to their complaints, providing incontrovertible proof and context for the authorities.",
      icon: <Database size={28} />,
      color: "var(--primary-dark)"
    },
    {
      title: "Analytics Dashboard",
      description: "Municipalities get access to a comprehensive overview of city health. See at a glance how many issues are pending, average resolution times, and the most affected zones.",
      icon: <LayoutDashboard size={28} />,
      color: "var(--danger-text)"
    }
  ];

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4"
          >
            Features built for modern cities
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Explore the powerful tools we provide to bridge the gap between citizens and local government.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="bg-card/50 backdrop-blur-sm border border-border/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 bg-primary/5 border border-primary/10 rounded-3xl p-10 text-center"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to improve your neighborhood?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of active citizens using JanKalyan to make their cities safer, cleaner, and better.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register" className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm w-full sm:w-auto text-center">
              Create an account
            </a>
            <a href="/complaints" className="px-8 py-3 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors shadow-sm w-full sm:w-auto text-center">
              View public issues
            </a>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default FeaturesPage;
