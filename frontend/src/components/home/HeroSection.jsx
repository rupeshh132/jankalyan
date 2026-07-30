import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { 
  ShieldCheck, Users, Building, Search, 
  LayoutDashboard, FileText, Settings, Bell, Circle, Filter,
  ChevronDown, AlertCircle, CheckCircle2, MapPin
} from 'lucide-react';
import { usePublicStatistics } from '../../hooks/useStatistics';
import './Hero.css';

const HeroSection = () => {
  const { data: statsData } = usePublicStatistics();
  const stats = statsData || { totalReports: 24592, resolvedReports: 18304, inProgressReports: 4120 };

  // Mouse Parallax for Dashboard (Elegant Apple Style - max 4deg)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX - innerWidth / 2) / 160);
    mouseY.set((clientY - innerHeight / 2) / -160); 
  };

  return (
    <section className="hero-wrapper" onMouseMove={handleMouseMove}>
      {/* Point 2: Subtle Background Mesh Glow */}
      <div className="mesh-glow" />

      {/* Top Text Content */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
          }
        }}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="hero-badge">
          <ShieldCheck size={14} color="var(--accent)" />
          Building Better Cities Together.
        </motion.div>
        
        <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="hero-headline">
          Report Issues.
          <span>Track Progress.</span>
          {/* Point 1: Text Gradient Shimmer */}
          <span className="text-gradient-shimmer">Improve Your City.</span>
        </motion.h1>
        
        <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="hero-desc">
          The infrastructure for modern municipalities. Connect citizens with local government through real-time tracking, transparent resolutions, and actionable analytics.
        </motion.p>
        
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="hero-cta-group">
          <Link to="/dashboard/report" className="btn-hero-primary">
            Report an Issue
          </Link>
          <Link to="/dashboard" className="btn-hero-secondary">
            Explore Complaints
          </Link>
        </motion.div>
        
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }} className="hero-trust">
          <div className="trust-item"><ShieldCheck size={14} /> Secure Platform</div>
          <div className="trust-item"><Users size={14} /> Community Driven</div>
          <div className="trust-item"><Building size={14} /> Government Ready</div>
        </motion.div>
      </motion.div>

      {/* Point 3: Scroll Reveal Dashboard Mockup */}
      <motion.div 
        id="dashboard"
        className="mockup-wrapper"
        initial={{ opacity: 0, y: 80, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div style={{ rotateX: springY, rotateY: springX }}>
          <div className="dashboard-ui">
            {/* App Header (Mac/SaaS style) */}
          <div className="db-header">
            <div className="db-header-left">
              <div className="db-dots">
                <div className="db-dot r" />
                <div className="db-dot y" />
                <div className="db-dot g" />
              </div>
              <div className="db-project-switcher">
                JanKalyan <span className="divider">/</span> <span className="active">City Operations</span> <ChevronDown size={14} />
              </div>
            </div>
            <div className="db-header-right">
              <Bell size={14} color="var(--text-muted)" />
              <div className="db-avatar" />
            </div>
          </div>
          
          <div className="db-body">
            {/* Sidebar (Linear Style) */}
            <div className="db-sidebar">
              <div className="db-sidebar-section">
                <div className="db-nav-item active">
                  <div className="db-nav-item-left"><LayoutDashboard size={14} /> Dashboard</div>
                </div>
                <div className="db-nav-item">
                  <div className="db-nav-item-left"><FileText size={14} /> Reports</div>
                  <div className="db-nav-badge">12</div>
                </div>
                <div className="db-nav-item">
                  <div className="db-nav-item-left"><MapPin size={14} /> Territories</div>
                </div>
              </div>
              
              <div className="db-sidebar-section">
                <div className="db-nav-section-title">Views</div>
                <div className="db-nav-item">
                  <div className="db-nav-item-left"><AlertCircle size={14} color="var(--danger-text)" /> Urgent Issues</div>
                </div>
                <div className="db-nav-item">
                  <div className="db-nav-item-left"><CheckCircle2 size={14} color="var(--text-muted)" /> Resolved</div>
                </div>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="db-main">
              {/* Toolbar */}
              <div className="db-toolbar">
                <div className="db-search">
                  <Search size={14} /> Search reports or zones...
                </div>
                <div className="db-toolbar-actions">
                  <button className="db-filter-btn"><Filter size={12} /> Filter</button>
                  <button className="db-filter-btn"><Settings size={12} /> View</button>
                </div>
              </div>

              <div className="db-content-scroll">
                {/* Top Stats */}
                <div className="db-stats-grid">
                  <div className="db-stat-card">
                    <div className="db-stat-header">Total Reports</div>
                    <div className="db-stat-value">{stats.totalReports.toLocaleString()}</div>
                  </div>
                  <div className="db-stat-card">
                    <div className="db-stat-header">Resolved <CheckCircle2 size={12} color="var(--success-text)"/></div>
                    <div className="db-stat-value">{stats.resolvedReports.toLocaleString()}</div>
                  </div>
                  <div className="db-stat-card">
                    <div className="db-stat-header">In Progress</div>
                    <div className="db-stat-value">{stats.inProgressReports.toLocaleString()}</div>
                  </div>
                  <div className="db-stat-card">
                    <div className="db-stat-header">Active Users</div>
                    <div className="db-stat-value">{stats.activeUsers ? stats.activeUsers.toLocaleString() : '1,204'}</div>
                  </div>
                </div>
                
                {/* Grid Layout */}
                <div className="db-layout-grid">
                  
                  {/* Realistic Table */}
                  <div className="db-table-panel">
                    <table className="db-table">
                      <thead>
                        <tr>
                          <th>Issue</th>
                          <th>Status</th>
                          <th>Priority</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div style={{fontWeight: 500}}>Pothole repair</div>
                            <div className="issue-tag">Sector 4, Main Rd</div>
                          </td>
                          <td><Circle size={10} fill="var(--success-text)" color="transparent" style={{marginRight: 4}}/> Resolved</td>
                          <td>High</td>
                          <td className="issue-tag">Oct 12</td>
                        </tr>
                        <tr>
                          <td>
                            <div style={{fontWeight: 500}}>Water leak</div>
                            <div className="issue-tag">Zone B, 5th Ave</div>
                          </td>
                          <td><Circle size={10} fill="var(--warning-text)" color="transparent" style={{marginRight: 4}}/> Pending</td>
                          <td>Urgent</td>
                          <td className="issue-tag">Oct 12</td>
                        </tr>
                        <tr>
                          <td>
                            <div style={{fontWeight: 500}}>Street lighting</div>
                            <div className="issue-tag">North District</div>
                          </td>
                          <td><Circle size={10} fill="var(--accent)" color="transparent" style={{marginRight: 4}}/> In Progress</td>
                          <td>Low</td>
                          <td className="issue-tag">Oct 11</td>
                        </tr>
                        <tr>
                          <td>
                            <div style={{fontWeight: 500}}>Waste collection</div>
                            <div className="issue-tag">East Sector</div>
                          </td>
                          <td><Circle size={10} fill="var(--success-text)" color="transparent" style={{marginRight: 4}}/> Resolved</td>
                          <td>Medium</td>
                          <td className="issue-tag">Oct 10</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Right Aside */}
                  <div className="db-aside">
                    <div className="db-aside-panel">
                      <div className="db-panel-title">Resolution Velocity</div>
                      <div className="mock-line-chart">
                        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                          <path d="M0,40 L0,30 Q10,20 20,25 T40,15 T60,20 T80,5 T100,10 L100,40 Z" fill="var(--accent-light)" />
                          <path d="M0,30 Q10,20 20,25 T40,15 T60,20 T80,5 T100,10" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="db-aside-panel">
                      <div className="db-panel-title">Recent Activity</div>
                      <div className="activity-feed">
                        <div className="activity-item">
                          <div className="activity-avatar">A</div>
                          <div className="activity-content">
                            <strong>Alex</strong> commented on <em>Water leak</em>
                            <div className="activity-time">2 hours ago</div>
                          </div>
                        </div>
                        <div className="activity-item">
                          <div className="activity-avatar" style={{background: 'var(--success-text)'}}>M</div>
                          <div className="activity-content">
                            <strong>Mayor's Office</strong> resolved <em>Pothole repair</em>
                            <div className="activity-time">5 hours ago</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
