import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { 
  ShieldCheck, Users, Building, ArrowRight, Activity, 
  MapPin, CheckCircle2, AlertCircle, TrendingUp, Search, 
  LayoutDashboard, FileText, Settings, Bell, Circle, Filter,
  ChevronDown, MessageSquare
} from 'lucide-react';
import { usePublicComplaints } from '../../hooks/useComplaints';
import ComplaintList from '../../components/complaint/ComplaintList';
import '../../components/complaint/complaint.css';
import '../../components/auth/auth.css';
import './Hero.css';

const HomePage = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, error, refetch } = usePublicComplaints(page, 5);

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
    <div className="page-container" onMouseMove={handleMouseMove}>
      
      {/* Premium Hero Section */}
      <section className="hero-wrapper">
        
        {/* Top Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div className="hero-badge">
            <ShieldCheck size={14} color="var(--accent)" />
            Building Better Cities Together.
          </div>
          
          <h1 className="hero-headline">
            Report Issues.
            <span>Track Progress.</span>
            <span>Improve Your City.</span>
          </h1>
          
          <p className="hero-desc">
            The infrastructure for modern municipalities. Connect citizens with local government through real-time tracking, transparent resolutions, and actionable analytics.
          </p>
          
          <div className="hero-cta-group">
            <Link to="/dashboard/report" className="btn-hero-primary">
              Report an Issue
            </Link>
            <Link to="/dashboard" className="btn-hero-secondary">
              Explore Complaints
            </Link>
          </div>
          
          <div className="hero-trust">
            <div className="trust-item"><ShieldCheck size={14} /> Secure Platform</div>
            <div className="trust-item"><Users size={14} /> Community Driven</div>
            <div className="trust-item"><Building size={14} /> Government Ready</div>
          </div>
        </motion.div>

        {/* Bottom Dashboard Mockup */}
        <motion.div 
          className="mockup-wrapper"
          style={{ rotateX: springY, rotateY: springX }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
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
                      <div className="db-stat-value">24,592</div>
                    </div>
                    <div className="db-stat-card">
                      <div className="db-stat-header">Resolved <CheckCircle2 size={12} color="var(--success-text)"/></div>
                      <div className="db-stat-value">18,304</div>
                    </div>
                    <div className="db-stat-card">
                      <div className="db-stat-header">In Progress</div>
                      <div className="db-stat-value">4,120</div>
                    </div>
                    <div className="db-stat-card">
                      <div className="db-stat-header">Avg Response</div>
                      <div className="db-stat-value">2.4d</div>
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
          </div>
        </motion.div>
        
      </section>

      {/* Latest Complaints (Untouched below Hero) */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="page-title" style={{ fontSize: '1.8rem', margin: 0 }}>Latest Community Reports</h2>
        </div>
        
        <ComplaintList 
          data={data} 
          isLoading={isLoading} 
          isError={isError} 
          error={error} 
          onPageChange={setPage} 
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default HomePage;
