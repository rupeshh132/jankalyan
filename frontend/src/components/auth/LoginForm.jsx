import React, { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { Link } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import './auth.css';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const { mutate: login, isPending, error } = useLogin();

  const validate = () => {
    const errors = {};
    if (!credentials.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(credentials.email)) errors.email = 'Email is invalid';
    
    if (!credentials.password) errors.password = 'Password is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      login(credentials);
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    return error.response?.data?.message || error.message || 'Login failed';
  };

  return (
    <div className="glass-card">
      <h2 className="auth-title">Welcome Back</h2>
      
      {error && <div className="auth-error">{getErrorMessage()}</div>}

      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label className="auth-label">Email</label>
          <input
            type="email"
            name="email"
            className="auth-input"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={handleChange}
            disabled={isPending}
          />
          {validationErrors.email && <span className="validation-error">{validationErrors.email}</span>}
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Password</label>
          <input
            type="password"
            name="password"
            className="auth-input"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleChange}
            disabled={isPending}
          />
          {validationErrors.password && <span className="validation-error">{validationErrors.password}</span>}
        </div>

        <button type="submit" className="auth-button" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
          {isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};

export default LoginForm;
