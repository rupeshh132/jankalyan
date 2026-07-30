import React from 'react';
import { MapPin, Activity, ShieldCheck } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section id="features" style={{ padding: '6rem var(--space-4)', backgroundColor: 'var(--bg-secondary)', marginBottom: '4rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Powerful Features for a Better City</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            JanKalyan equips citizens and municipalities with the tools they need to report, track, and resolve urban issues efficiently.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Feature 1 */}
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
              <MapPin size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Precise Location Tracking</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Pinpoint exact locations of municipal issues. Help city workers find and fix problems faster with accurate geolocation data.</p>
          </div>
          
          {/* Feature 2 */}
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent)' }}>
              <Activity size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Real-time Progress Updates</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Follow your reports from submission to resolution. Get instant notifications when status changes or comments are added.</p>
          </div>
          
          {/* Feature 3 */}
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--success-text)' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Transparent Governance</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Hold authorities accountable with open data. View community statistics, resolution times, and departmental performance.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
