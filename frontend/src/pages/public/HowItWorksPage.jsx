import React from 'react';
import { UserPlus, FileEdit, Activity, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorksPage = () => {
  const steps = [
    {
      id: '01',
      title: 'Create an Account',
      description: 'Register securely on the JanKalyan platform using your email or phone number. A secure account ensures your data and complaints remain private.',
      icon: UserPlus,
    },
    {
      id: '02',
      title: 'Submit your Grievance',
      description: 'Fill out a simple form detailing your issue. Select categories, provide a detailed description, and attach photos as proof.',
      icon: FileEdit,
    },
    {
      id: '03',
      title: 'Track in Real-Time',
      description: 'Monitor the exact status of your complaint directly from your personalized dashboard. Get instant notifications whenever there is an update.',
      icon: Activity,
    },
    {
      id: '04',
      title: 'Quick Resolution',
      description: 'Dedicated authorities review your grievance and take necessary actions. Once resolved, you will be notified and can provide feedback.',
      icon: CheckCircle,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2' }}>

      {/* Hero Section */}
      <div style={{ padding: '80px 24px 48px', textAlign: 'center', maxWidth: '1280px', margin: '0 auto' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: '#6b7280', textTransform: 'uppercase', display: 'block', marginBottom: '16px' }}>
          Platform Guide
        </span>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, color: '#111827', lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 20px 0' }}>
          How JanKalyan works.
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', color: '#6b7280', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
          Report civic issues in your community and track their resolution — transparently and securely.
        </p>
      </div>

      {/* Steps Grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2px',
          background: '#e2e8f0',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                style={{ background: '#ffffff', padding: '40px 32px', position: 'relative' }}
              >
                {/* Step number */}
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '48px', fontWeight: 800,
                  color: '#f1f5f9', lineHeight: 1, marginBottom: '20px',
                  letterSpacing: '-0.03em', userSelect: 'none',
                }}>
                  {step.id}
                </div>

                {/* Icon (monochrome) */}
                <Icon size={24} style={{ color: '#374151', marginBottom: '16px' }} />

                {/* Title */}
                <h3 style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 700,
                  color: '#111827', margin: '0 0 12px 0', letterSpacing: '-0.01em',
                }}>
                  {step.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '14px',
                  color: '#6b7280', lineHeight: 1.7, margin: 0,
                }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div style={{
          marginTop: '64px', textAlign: 'center',
          background: '#111827', borderRadius: '16px', padding: '64px 32px',
        }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 16px 0' }}>
            Ready to make a difference?
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 40px' }}>
            Join thousands of citizens who are actively contributing to a better society.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#ffffff', color: '#111827',
                fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700,
                padding: '12px 28px', borderRadius: '8px', textDecoration: 'none',
                transition: 'background 0.5s ease, color 0.5s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#111827'; }}
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/complaints"
              style={{
                fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500,
                color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
            >
              View Public Board →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
