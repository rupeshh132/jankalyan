import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "tween", ease: "easeOut", duration: 0.5 }
    }
  };

  const values = [
    {
      title: "Transparency First",
      description: "We believe citizens have the right to know exactly what is happening in their neighborhoods and how their local government is responding.",
      icon: <Globe size={24} />,
      color: "var(--info-text)"
    },
    {
      title: "Community Empowerment",
      description: "A city is only as strong as its community. We provide the tools for neighbors to collaborate and raise their voices together.",
      icon: <Users size={24} />,
      color: "var(--primary)"
    },
    {
      title: "Accountable Governance",
      description: "By providing data-driven insights and public tracking, we help municipal authorities stay accountable and deliver better civic services.",
      icon: <Shield size={24} />,
      color: "var(--success-text)"
    },
    {
      title: "Tech for Good",
      description: "We leverage modern web technologies not just to build software, but to bridge the gap between people and policy, creating real-world impact.",
      icon: <Heart size={24} />,
      color: "var(--danger-text)"
    }
  ];

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            About JanKalyan
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6"
          >
            Building the foundation for <br className="hidden md:block"/> smarter, responsive cities.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            JanKalyan (Public Welfare) is a modern civic-tech initiative designed to streamline communication between citizens and municipal bodies. We replace archaic complaint systems with transparent, real-time public boards.
          </motion.p>
        </div>

        {/* Mission Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm text-center mb-20"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium">
            "To democratize city infrastructure management by empowering every citizen with a voice, and equipping every municipality with the tools to listen, act, and resolve."
          </p>
        </motion.div>

        {/* Core Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-muted-foreground">The principles that guide our platform development.</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="bg-card/50 backdrop-blur-sm border border-border/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${value.color}15`, color: value.color }}
                >
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
          className="mt-12 bg-primary text-primary-foreground rounded-3xl p-10 text-center shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Be a part of the change</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Whether you are a concerned citizen or a proactive government official, JanKalyan is built for you. Start using the platform today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="px-8 py-3 bg-background text-primary font-medium rounded-lg hover:bg-background/90 transition-colors shadow-sm w-full sm:w-auto text-center">
              Join as Citizen
            </Link>
            <Link to="/how-it-works" className="px-8 py-3 bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 font-medium rounded-lg hover:bg-primary-foreground/20 transition-colors shadow-sm w-full sm:w-auto text-center">
              Learn more
            </Link>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default AboutPage;
