import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F6F2' }} className="flex flex-col lg:flex-row">

      {/* Mobile-only compact dark banner */}
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
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '120%', height: '120%', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', top: '20%', right: '20%', width: '60%', height: '60%', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.07)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>01 / Registration</span>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0 }}>
            Your city. Your voice.
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
              01 / Registration
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
              Join the<br/>movement.
            </h1>
          </div>

          <RegisterForm />
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
          <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '140%', height: '140%', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)', boxShadow: 'inset 0 0 100px rgba(255,255,255,0.02)' }} />
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '120%', height: '120%', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', top: '0%', right: '0%', width: '100%', height: '100%', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '56px', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 24px 0' }}>
            Your city.<br/>Your voice.
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', color: '#a1a1aa', lineHeight: 1.6, maxWidth: '480px', margin: 0 }}>
            JanKalyan empowers citizens to drive real change through transparency and collective action.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
