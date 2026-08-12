import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2' }} className="flex flex-col lg:flex-row">

      {/* Mobile-only compact dark banner (visible only below lg) */}
      <div className="lg:hidden" style={{
        background: '#0a0a0a',
        padding: '28px 24px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
          <div style={{ position: 'absolute', top: '10%', right: '10%', width: '80%', height: '80%', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'absolute', top: '30%', right: '30%', width: '40%', height: '40%', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.08)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>02 / Login</span>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0 }}>
            12,000+ issues resolved.
          </h2>
        </div>
      </div>

      {/* Left Panel - Form */}
      <div style={{
        flex: '1 1 50%',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }} className="lg:px-16">
        <div style={{ maxWidth: '420px', width: '100%' }}>
          <div style={{ marginBottom: '32px' }} className="hidden lg:block">
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: '#888',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '12px'
            }}>
              02 / Login
            </span>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '40px',
              fontWeight: 800,
              color: '#111827',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0
            }}>
              Welcome<br/>back.
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6b7280', marginTop: '12px' }}>
              Sign in to report and track civic issues
            </p>
          </div>

          <LoginForm />
        </div>
      </div>

      {/* Right Panel - Cinematic (desktop only) */}
      <div className="hidden lg:flex" style={{
        flex: '1 1 50%',
        background: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(40px, 5vw, 80px)',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
          <div style={{ position: 'absolute', top: '10%', right: '10%', width: '80%', height: '80%', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 0 100px rgba(255,255,255,0.01)' }} />
          <div style={{ position: 'absolute', top: '25%', right: '25%', width: '50%', height: '50%', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'absolute', top: '40%', right: '40%', width: '20%', height: '20%', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.08)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '56px', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 24px 0' }}>
            12,000+ issues<br/>resolved.
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', color: '#a1a1aa', lineHeight: 1.6, maxWidth: '480px', margin: 0 }}>
            Join the community of citizens actively making a difference in their neighborhoods everyday.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
