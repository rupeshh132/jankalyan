import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Activity, Users, ShieldCheck, Database, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesPage = () => {
  return (
    <div style={{ background: '#F4F3ED', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 80px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#666', marginBottom: '32px' }}>
          Core Capabilities
        </p>
        <h1 style={{ 
          fontFamily: 'Playfair Display, serif', 
          fontSize: 'clamp(40px, 6vw, 64px)', 
          fontWeight: 700, 
          color: '#1C1C1A', 
          margin: '0 0 24px 0', 
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          maxWidth: '800px'
        }}>
          Empowering communities through systemic transparency.
        </h1>
        <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.6, maxWidth: '600px', margin: 0 }}>
          A comprehensive toolset designed to replace fragmented reporting with a unified, actionable, and accountable civic network.
        </p>
      </div>

      {/* Grid Layout Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
          
          {/* Card 01 - Large Left */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 col-span-12"
          >
            <div style={{ background: '#FFFFFF', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div style={{ padding: '64px 48px 0', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', color: '#6b7280', fontWeight: 600 }}>01</span>
                  <MapPin size={24} color="#D05A44" strokeWidth={2} />
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700, color: '#1C1C1A', margin: '0 0 20px 0', lineHeight: 1.2 }}>
                  Geolocated Incident Reporting
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#555', lineHeight: 1.7, margin: '0 0 48px 0' }}>
                  Pinpoint precise coordinates for civic issues. Our platform maps reports with rigorous accuracy, allowing local authorities to visualize clusters, prioritize dispatches, and track resolution timelines geographically.
                </p>
              </div>
              <div style={{ background: '#f8f8f8', padding: '0 48px' }}>
                <img src="/geolocated_map_ui.jpg" alt="Geolocated map" style={{ width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'top', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', marginTop: '20px', border: '1px solid #eaeaea', borderBottom: 'none' }} />
              </div>
            </div>
          </motion.div>

          {/* Cards 02-05 Stacked Right */}
          <div className="lg:col-span-5 col-span-12" style={{ display: 'flex', flexDirection: 'column' }}>
            
            {[
              { num: '02', title: 'Real-Time Tracking & Transparency', desc: 'Monitor the lifecycle of every report from submission to resolution with immutable timestamp logs.', icon: Activity, bg: 'transparent' },
              { num: '03', title: 'Community Upvoting', desc: 'Democratize prioritization. Allow citizens to validate and escalate issues affecting their immediate neighborhood.', icon: Users, bg: '#FFFFFF' },
              { num: '04', title: 'Role-Based Access Control', desc: 'Secure segmented views for citizens, municipal workers, and administrative oversight committees.', icon: ShieldCheck, bg: 'transparent' },
              { num: '05', title: 'Rich Media Attachments', desc: 'Provide irrefutable context by appending high-resolution imagery and documentation to civic tickets.', icon: Database, bg: '#FFFFFF' }
            ].map((item, idx) => (
              <motion.div 
                key={item.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                style={{ background: item.bg, padding: '48px 40px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              >
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: '#6b7280', letterSpacing: '0.05em' }}>{item.num}</span>
                  <item.icon size={15} color="#D05A44" strokeWidth={2} />
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700, color: '#1C1C1A', margin: '0 0 16px 0' }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#555', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}

          </div>

          {/* Card 06 - Full Width Bottom */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-12"
            style={{ background: '#FFFFFF', marginTop: '24px' }}
          >
            <div className="flex flex-col lg:flex-row items-stretch">
              <div style={{ padding: '64px 48px', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#1C1C1A', fontStyle: 'italic' }}>06</span>
                  <LayoutDashboard size={16} color="#D05A44" strokeWidth={2.5} />
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: '#1C1C1A', margin: '0 0 16px 0', lineHeight: 1.2 }}>
                  Analytics Dashboard
                </h3>
                <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.7, margin: 0, maxWidth: '400px' }}>
                  Transform civic data into actionable intelligence. Analyze response times, identify systemic infrastructural weaknesses, and allocate municipal resources based on empirical evidence rather than intuition.
                </p>
              </div>
              <div style={{ flex: '1.2', background: '#f8f8f8', padding: '40px', display: 'flex', alignItems: 'center' }}>
                <img src="/analytics_dashboard_ui.jpg" alt="Analytics Dashboard" style={{ width: '100%', border: '1px solid #eaeaea', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Footer CTA Section */}
      <div style={{ background: '#1A1A1A', padding: '100px 24px', color: '#FFFFFF' }}>
        <div 
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          style={{ maxWidth: '1000px', margin: '0 auto' }}
        >
          <div style={{ flex: 1, maxWidth: '600px' }}>
            <h2 style={{ 
              fontFamily: 'Playfair Display, serif', 
              fontSize: '48px', 
              fontWeight: 700, 
              margin: '0 0 16px 0', 
              lineHeight: 1.1, 
              letterSpacing: '-0.02em',
              color: '#FFFFFF'
            }}>
              Ready to improve <br /> your neighborhood?
            </h2>
            <p style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px', 
              color: '#D4D4D8', 
              lineHeight: 1.6, 
              margin: 0,
              maxWidth: '500px'
            }}>
              Implement our tools to establish a transparent, responsive, and data-driven relationship with your local government.
            </p>
          </div>
          <div>
            <Link 
              to="/register" 
              style={{
                display: 'inline-block',
                background: '#C25E46', // Matched exact terracotta color
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '16px 32px',
                textDecoration: 'none',
                transition: 'background 0.2s',
                border: 'none',
                borderRadius: '0', // Sharp corners
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#a84e38'}
              onMouseLeave={e => e.currentTarget.style.background = '#C25E46'}
            >
              JOIN THE MOVEMENT
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FeaturesPage;
