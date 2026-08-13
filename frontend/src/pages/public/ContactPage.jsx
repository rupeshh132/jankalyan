import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe, Code2, Phone, MessageSquare } from 'lucide-react';

const ContactPage = () => {
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

  const contactLinks = [
    {
      title: "Email",
      value: "vrupesh132@gmail.com",
      href: "mailto:vrupesh132@gmail.com",
      icon: <Mail size={24} />,
      color: "var(--danger-text)",
      bg: "var(--danger-text)"
    },
    {
      title: "LinkedIn",
      value: "Rupesh Vishwakarma",
      href: "https://www.linkedin.com/in/rupesh-vishwakarma-10a904225/",
      icon: <Globe size={24} />,
      color: "var(--info-text)",
      bg: "var(--info-text)"
    },
    {
      title: "GitHub",
      value: "rupeshh132",
      href: "https://github.com/rupeshh132",
      icon: <Code2 size={24} />,
      color: "var(--foreground)",
      bg: "var(--foreground)"
    },
    {
      title: "Phone / WhatsApp",
      value: "+91 8090683207",
      href: "https://wa.me/918090683207",
      icon: <Phone size={24} />,
      color: "var(--success-text)",
      bg: "var(--success-text)"
    }
  ];

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6"
          >
            Let's connect
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Have a question, feedback, or just want to say hi? I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </motion.p>
        </div>

        {/* Contact Links Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {contactLinks.map((contact, index) => (
            <motion.a 
              key={index}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              className="group flex items-center p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50"
            >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mr-6 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${contact.bg}15`, color: contact.color }}
              >
                {contact.icon}
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{contact.title}</h3>
                <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {contact.value}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Contact Form Placeholder / Extra Info */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          className="mt-16 text-white rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden"
          style={{
            backgroundImage: "url('/cta-bg-clean.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 text-white rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
              <MessageSquare size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Fastest way to reach me</h2>
            <p className="text-white/90 max-w-xl mx-auto mb-8 text-lg">
              For the quickest response, feel free to drop a message on WhatsApp or connect with me on LinkedIn. I try my best to respond within 24 hours.
            </p>
            <a href="https://wa.me/918090683207" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-sm">
              Message on WhatsApp
            </a>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default ContactPage;
