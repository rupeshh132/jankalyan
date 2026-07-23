import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, FileQuestion, AlertTriangle, CheckCircle2 } from 'lucide-react';

const HelpCenterPage = () => {
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
      transition: { type: "tween", ease: "easeOut", duration: 0.5 }
    }
  };

  const faqs = [
    {
      category: "Getting Started",
      icon: <HelpCircle className="text-primary w-6 h-6" />,
      questions: [
        {
          q: "How do I create an account?",
          a: "Click on the 'Get Started' button in the top right corner. You can register using your email address, phone number, and a secure password. Once registered, you will have access to your personal dashboard."
        },
        {
          q: "Is JanKalyan free to use?",
          a: "Yes, JanKalyan is completely free for all citizens. Our goal is to make public grievance redressal accessible to everyone without any hidden charges."
        }
      ]
    },
    {
      category: "Reporting Issues",
      icon: <AlertTriangle className="text-warning w-6 h-6" />,
      questions: [
        {
          q: "How do I report a new issue?",
          a: "Log into your account and click on 'Report an Issue' from your dashboard. Fill in the required details including the issue type, location, description, and attach any relevant photos as proof."
        },
        {
          q: "Can I remain anonymous while reporting?",
          a: "Currently, you need a verified account to submit a report to prevent spam. However, your personal details (like phone number) are kept strictly confidential and are only visible to authorized municipal admins."
        }
      ]
    },
    {
      category: "Tracking & Resolution",
      icon: <CheckCircle2 className="text-success w-6 h-6" />,
      questions: [
        {
          q: "How do I know the status of my complaint?",
          a: "You can track the real-time status of your complaint in your Dashboard under 'My Complaints'. You will also receive notifications when the status changes (e.g., from Pending to In Progress)."
        },
        {
          q: "What if my issue is marked 'Resolved' but isn't fixed?",
          a: "If an issue is incorrectly marked as resolved, you can reopen the ticket or add a comment to the existing complaint stating that the problem persists. Authorities will be notified immediately."
        }
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            Help Center
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6"
          >
            How can we help you?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Find answers to common questions about using the JanKalyan platform, reporting issues, and tracking resolutions.
          </motion.p>
        </div>

        {/* FAQs */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {faqs.map((section, index) => (
            <motion.div key={index} variants={itemVariants} className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                {section.icon}
                <h2 className="text-2xl font-semibold text-foreground">{section.category}</h2>
              </div>
              
              <div className="space-y-8">
                {section.questions.map((item, qIndex) => (
                  <div key={qIndex} className="pl-9 relative">
                    <div className="absolute left-0 top-1 text-primary">
                      <FileQuestion size={20} />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">{item.q}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Support CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          className="mt-16 bg-muted/50 border border-border rounded-3xl p-8 text-center"
        >
          <h2 className="text-xl font-bold text-foreground mb-2">Still need help?</h2>
          <p className="text-muted-foreground mb-6">If you couldn't find the answer to your question, we're here to help.</p>
          <a href="/contact" className="inline-flex items-center justify-center px-6 py-2.5 bg-background border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors shadow-sm">
            Contact Support
          </a>
        </motion.div>
        
      </div>
    </div>
  );
};

export default HelpCenterPage;
