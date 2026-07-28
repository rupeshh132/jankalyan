import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'jankalyan_welcome_seen';

const WelcomeSplash = () => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Show only once per session
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }, 500);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      animation: closing ? 'fadeOut 0.5s ease forwards' : 'fadeIn 0.4s ease forwards',
      padding: '16px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99,102,241,0.5); }
          70% { transform: scale(1); box-shadow: 0 0 0 12px rgba(99,102,241,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        .welcome-card {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 24px;
          padding: 48px 40px 36px;
          max-width: 560px;
          width: 100%;
          position: relative;
          animation: slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
          box-shadow: 0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 50px;
          padding: 6px 14px;
          font-size: 11px;
          font-weight: 600;
          color: #a5b4fc;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
          animation: pulse-ring 2s infinite;
        }
        .welcome-title {
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.25;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
        }
        .creator-name {
          background: linear-gradient(90deg, #6366f1, #a78bfa, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .welcome-subtitle {
          font-size: 15px;
          color: #94a3b8;
          margin: 0 0 32px;
          line-height: 1.6;
          font-weight: 400;
        }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent);
          margin: 0 0 28px;
        }
        .how-to-title {
          font-size: 11px;
          font-weight: 700;
          color: #6366f1;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 0 0 16px;
        }
        .steps {
          list-style: none;
          padding: 0;
          margin: 0 0 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.5;
        }
        .step-num {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: white;
          margin-top: 1px;
        }
        .close-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.3px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(99,102,241,0.4);
        }
        .close-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(99,102,241,0.55);
        }
        .close-btn:active {
          transform: translateY(0);
        }
        .thank-you {
          text-align: center;
          margin-top: 20px;
          font-size: 13px;
          color: #475569;
          font-weight: 400;
        }
        .thank-you span {
          color: #6366f1;
          font-weight: 600;
        }
        .corner-x {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          font-size: 16px;
          transition: all 0.2s;
        }
        .corner-x:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .logo-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          font-size: 22px;
          box-shadow: 0 4px 20px rgba(99,102,241,0.4);
        }
      `}</style>

      <div className="welcome-card">
        {/* Close X button */}
        <div className="corner-x" onClick={handleClose}>✕</div>

        {/* Logo */}
        <div className="logo-icon">🏛️</div>

        {/* Badge */}
        <div className="badge">
          <span className="badge-dot"></span>
          Official Platform
        </div>

        {/* Title */}
        <h1 className="welcome-title">
          Welcome to <span className="creator-name">JanKalyan</span>
        </h1>
        <p className="welcome-subtitle">
          Namaste! I am <strong style={{color:'#c4b5fd'}}>Rupesh Vishwakarma</strong>, the creator of this platform.
          Welcome to the JanKalyan Portal. 🙏
        </p>

        <div className="divider"></div>

        {/* How to use */}
        <p className="how-to-title">📋 How to Use</p>
        <ul className="steps">
          <li className="step">
            <span className="step-num">1</span>
            <span><strong style={{color:'#e2e8f0'}}>Register / Login</strong> — Create your account and log in</span>
          </li>
          <li className="step">
            <span className="step-num">2</span>
            <span><strong style={{color:'#e2e8f0'}}>Report an Issue</strong> — Use the "Report an Issue" button to submit a problem</span>
          </li>
          <li className="step">
            <span className="step-num">3</span>
            <span><strong style={{color:'#e2e8f0'}}>Track Status</strong> — View the real-time status of your complaint on the Dashboard</span>
          </li>
          <li className="step">
            <span className="step-num">4</span>
            <span><strong style={{color:'#e2e8f0'}}>Upvote</strong> — Support others by upvoting important complaints</span>
          </li>
        </ul>

        {/* CTA Button */}
        <button className="close-btn" onClick={handleClose}>
          ✨ Explore Platform
        </button>

        {/* Thank you */}
        <p className="thank-you">
          <span>❤️ Thank You</span> for visiting JanKalyan — Together, let's build a better city.
        </p>
      </div>
    </div>
  );
};

export default WelcomeSplash;
