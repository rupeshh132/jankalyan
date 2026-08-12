import React, { useState } from 'react';
import { useRegister } from '../../hooks/useRegister';
import { useGoogleLoginHook } from '../../hooks/useLogin';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { GoogleLogin } from '@react-oauth/google';

const RegisterForm = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  const { mutate: register, isPending, error } = useRegister();
  const { mutate: googleLogin, isPending: isGooglePending, error: googleError } = useGoogleLoginHook();

  const validate = () => {
    const errors = {};
    if (!userData.fullName) errors.fullName = 'Full Name is required';
    if (!userData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(userData.email)) errors.email = 'Email is invalid';
    if (!userData.phone) errors.phone = 'Phone is required';
    if (!userData.password) errors.password = 'Password is required';
    else if (userData.password.length < 8) errors.password = 'Minimum 8 characters';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      register(userData);
    }
  };

  const getErrorMessage = () => {
    const err = error || googleError;
    if (!err) return null;
    return err.response?.data?.message || err.message || 'Registration failed';
  };

  const isAnyPending = isPending || isGooglePending;

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

      <form onSubmit={handleSubmit}>
        <div style={wrapperStyle}>
          <label htmlFor="fullName" style={labelStyle}>Full Name</label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
            disabled={isAnyPending}
            style={{ ...inputStyle, borderBottomColor: validationErrors.fullName ? '#ef4444' : '#d1d5db' }}
            onFocus={(e) => e.target.style.borderBottomColor = '#111827'}
            onBlur={(e) => e.target.style.borderBottomColor = validationErrors.fullName ? '#ef4444' : '#d1d5db'}
          />
          {validationErrors.fullName && <p style={{ fontSize: '11px', color: '#ef4444', margin: '4px 0 0 0' }}>{validationErrors.fullName}</p>}
        </div>

        <div style={wrapperStyle}>
          <label htmlFor="email" style={labelStyle}>Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            disabled={isAnyPending}
            style={{ ...inputStyle, borderBottomColor: validationErrors.email ? '#ef4444' : '#d1d5db' }}
            onFocus={(e) => e.target.style.borderBottomColor = '#111827'}
            onBlur={(e) => e.target.style.borderBottomColor = validationErrors.email ? '#ef4444' : '#d1d5db'}
          />
          {validationErrors.email && <p style={{ fontSize: '11px', color: '#ef4444', margin: '4px 0 0 0' }}>{validationErrors.email}</p>}
        </div>

        <div style={wrapperStyle}>
          <label htmlFor="phone" style={labelStyle}>Phone Number</label>
          <input
            id="phone"
            type="text"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            disabled={isAnyPending}
            style={{ ...inputStyle, borderBottomColor: validationErrors.phone ? '#ef4444' : '#d1d5db' }}
            onFocus={(e) => e.target.style.borderBottomColor = '#111827'}
            onBlur={(e) => e.target.style.borderBottomColor = validationErrors.phone ? '#ef4444' : '#d1d5db'}
          />
          {validationErrors.phone && <p style={{ fontSize: '11px', color: '#ef4444', margin: '4px 0 0 0' }}>{validationErrors.phone}</p>}
        </div>

        <div style={wrapperStyle}>
          <label htmlFor="password" style={labelStyle}>Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={userData.password}
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
          {isPending ? <Loader2 className="animate-spin" size={16} /> : 'Create Account'}
        </button>
      </form>

      <div style={{ marginTop: '16px', position: 'relative' }}>
        {/* We use a wrapper that mimics the custom button, and hide the iframe opacity slightly, or just use the outline theme which is close to minimal */}
        <div style={{ 
          display: 'flex', justifyContent: 'center', overflow: 'hidden', borderRadius: '4px', 
          border: '1px solid #e5e7eb', background: 'transparent' 
        }}>
          <GoogleLogin
            onSuccess={credentialResponse => {
              googleLogin({ idToken: credentialResponse.credential });
            }}
            onError={() => {}}
            theme="outline"
            size="large"
            text="signup_with"
            shape="rectangular"
            width="100%"
          />
        </div>
      </div>

      <p style={{ marginTop: '32px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6b7280', textAlign: 'center' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#111827', fontWeight: 600, textDecoration: 'none' }}>
          Log in &rarr;
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
