import React, { useState } from 'react';
import { useLogin, useGoogleLoginHook, useSendOtp, useVerifyOtp } from '../../hooks/useLogin';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { GoogleLogin } from '@react-oauth/google';

const LoginForm = () => {
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'otp'
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const { mutate: login, isPending: isLoginPending, error: loginError } = useLogin();
  const { mutate: googleLogin, isPending: isGooglePending, error: googleError } = useGoogleLoginHook();
  const { mutate: sendOtp, isPending: isOtpPending, error: otpError } = useSendOtp();
  const { mutate: verifyOtp, isPending: isVerifyPending, error: verifyError } = useVerifyOtp();

  const validateEmail = () => {
    const errors = {};
    if (!credentials.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(credentials.email)) errors.email = 'Email is invalid';
    if (!credentials.password) errors.password = 'Password is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePhone = () => {
    const errors = {};
    if (!phone) errors.phone = 'Phone number is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateOtp = () => {
    const errors = {};
    if (!otpCode) errors.otpCode = 'OTP is required';
    else if (otpCode.length !== 6) errors.otpCode = 'OTP must be 6 digits';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (validateEmail()) {
      login(credentials);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (validatePhone()) {
      sendOtp({ phone }, {
        onSuccess: () => setIsOtpSent(true)
      });
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (validateOtp()) {
      verifyOtp({ phone, otpCode });
    }
  };

  const getErrorMessage = () => {
    const err = loginError || googleError || otpError || verifyError;
    if (!err) return null;
    return err.response?.data?.message || err.message || 'Action failed';
  };

  const isAnyPending = isLoginPending || isGooglePending || isOtpPending || isVerifyPending;

  const inputStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #d1d5db',
    borderRadius: '0',
    padding: '8px 0',
    fontFamily: 'Inter, sans-serif',
    fontSize: '15px',
    color: '#111827',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    fontFamily: 'Inter, sans-serif',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#6b7280',
    marginBottom: '4px',
  };

  const wrapperStyle = {
    marginBottom: '20px',
  };

  return (
    <div style={{ width: '100%' }}>
      {getErrorMessage() && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{getErrorMessage()}</AlertDescription>
        </Alert>
      )}

      {/* Google Login custom wrapper */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center', overflow: 'hidden', borderRadius: '4px', border: '1px solid #e5e7eb', background: 'transparent' }}>
        <GoogleLogin
          onSuccess={credentialResponse => {
            googleLogin({ idToken: credentialResponse.credential });
          }}
          onError={() => {}}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          width="100%"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
        <div style={{ flex: 1, borderTop: '1px solid #e5e7eb' }}></div>
        <span style={{ padding: '0 12px', fontSize: '10px', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Or continue with</span>
        <div style={{ flex: 1, borderTop: '1px solid #e5e7eb' }}></div>
      </div>

      {/* Minimal Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('email')}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'email' ? '2px solid #111827' : '2px solid transparent',
            padding: '12px 0',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            color: activeTab === 'email' ? '#111827' : '#9ca3af',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          EMAIL
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('otp')}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'otp' ? '2px solid #111827' : '2px solid transparent',
            padding: '12px 0',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            color: activeTab === 'otp' ? '#111827' : '#9ca3af',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          PHONE (OTP)
        </button>
      </div>

      {activeTab === 'email' && (
        <form onSubmit={handleEmailSubmit}>
          <div style={wrapperStyle}>
            <label htmlFor="email" style={labelStyle}>Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              disabled={isAnyPending}
              style={{ ...inputStyle, borderBottomColor: validationErrors.email ? '#ef4444' : '#d1d5db' }}
              onFocus={(e) => e.target.style.borderBottomColor = '#111827'}
              onBlur={(e) => e.target.style.borderBottomColor = validationErrors.email ? '#ef4444' : '#d1d5db'}
            />
            {validationErrors.email && <p style={{ fontSize: '11px', color: '#ef4444', margin: '4px 0 0 0' }}>{validationErrors.email}</p>}
          </div>

          <div style={wrapperStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <label htmlFor="password" style={labelStyle}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '11px', color: '#6b7280', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              disabled={isAnyPending}
              style={{ ...inputStyle, borderBottomColor: validationErrors.password ? '#ef4444' : '#d1d5db' }}
              onFocus={(e) => e.target.style.borderBottomColor = '#111827'}
              onBlur={(e) => e.target.style.borderBottomColor = validationErrors.password ? '#ef4444' : '#d1d5db'}
            />
            {validationErrors.password && <p style={{ fontSize: '11px', color: '#ef4444', margin: '4px 0 0 0' }}>{validationErrors.password}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isAnyPending}
            style={{
              width: '100%',
              padding: '12px',
              background: '#111827',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: isAnyPending ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '24px',
              transition: 'background 0.5s ease',
            }}
            onMouseEnter={e => e.target.style.background = '#2563eb'}
            onMouseLeave={e => e.target.style.background = '#111827'}
          >
            {isLoginPending ? <Loader2 className="animate-spin" size={16} /> : 'Sign In'}
          </button>
        </form>
      )}

      {activeTab === 'otp' && (
        <div>
          {!isOtpSent ? (
            <form onSubmit={handleSendOtp}>
              <div style={wrapperStyle}>
                <label htmlFor="phone" style={labelStyle}>Phone Number</label>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (validationErrors.phone) setValidationErrors({ ...validationErrors, phone: '' });
                  }}
                  disabled={isAnyPending}
                  style={{ ...inputStyle, borderBottomColor: validationErrors.phone ? '#ef4444' : '#d1d5db' }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#111827'}
                  onBlur={(e) => e.target.style.borderBottomColor = validationErrors.phone ? '#ef4444' : '#d1d5db'}
                />
                {validationErrors.phone && <p style={{ fontSize: '11px', color: '#ef4444', margin: '4px 0 0 0' }}>{validationErrors.phone}</p>}
              </div>
              <button 
                type="submit" 
                disabled={isAnyPending}
                style={{
                  width: '100%', padding: '12px', background: '#111827', color: '#fff', border: 'none',
                  borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em', cursor: isAnyPending ? 'not-allowed' : 'pointer',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px',
                  transition: 'background 0.5s ease',
                }}
                onMouseEnter={e => e.target.style.background = '#2563eb'}
                onMouseLeave={e => e.target.style.background = '#111827'}
              >
                {isOtpPending ? <Loader2 className="animate-spin" size={16} /> : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>OTP sent to {phone}</p>
                <button 
                  type="button" 
                  onClick={() => setIsOtpSent(false)} 
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Change number
                </button>
              </div>
              <div style={wrapperStyle}>
                <label htmlFor="otpCode" style={labelStyle}>Enter OTP</label>
                <input
                  id="otpCode"
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value);
                    if (validationErrors.otpCode) setValidationErrors({ ...validationErrors, otpCode: '' });
                  }}
                  disabled={isAnyPending}
                  style={{ ...inputStyle, textAlign: 'center', letterSpacing: '0.5em', borderBottomColor: validationErrors.otpCode ? '#ef4444' : '#d1d5db' }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#111827'}
                  onBlur={(e) => e.target.style.borderBottomColor = validationErrors.otpCode ? '#ef4444' : '#d1d5db'}
                />
                {validationErrors.otpCode && <p style={{ fontSize: '11px', color: '#ef4444', margin: '4px 0 0 0', textAlign: 'center' }}>{validationErrors.otpCode}</p>}
              </div>
              <button 
                type="submit" 
                disabled={isAnyPending}
                style={{
                  width: '100%', padding: '12px', background: '#111827', color: '#fff', border: 'none',
                  borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em', cursor: isAnyPending ? 'not-allowed' : 'pointer',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px',
                  transition: 'background 0.5s ease',
                }}
                onMouseEnter={e => e.target.style.background = '#2563eb'}
                onMouseLeave={e => e.target.style.background = '#111827'}
              >
                {isVerifyPending ? <Loader2 className="animate-spin" size={16} /> : 'Verify & Login'}
              </button>
            </form>
          )}
        </div>
      )}

      <p style={{ marginTop: '32px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6b7280', textAlign: 'center' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
          Register here &rarr;
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
