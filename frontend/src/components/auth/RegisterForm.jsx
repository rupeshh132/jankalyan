import React, { useState } from 'react';
import { useRegister } from '../../hooks/useRegister';
import { Link } from 'react-router-dom';
import { UserPlus, Loader2 } from 'lucide-react';
import './auth.css';

const RegisterForm = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const { mutate: register, isPending, error } = useRegister();

  const validate = () => {
    const errors = {};
    if (!userData.fullName) errors.fullName = 'Full Name is required';
    else if (userData.fullName.length > 100) errors.fullName = 'Max 100 characters';
    
    if (!userData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(userData.email)) errors.email = 'Email is invalid';

    if (!userData.phone) errors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(userData.phone)) errors.phone = 'Invalid phone number format';

    if (!userData.password) errors.password = 'Password is required';
    else if (userData.password.length < 8) errors.password = 'Minimum 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(userData.password)) {
      errors.password = 'Must contain uppercase, lowercase, number, and special character';
    }
    
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
    if (!error) return null;
    return error.response?.data?.message || error.message || 'Registration failed';
  };

  return (
    <div className="glass-card">
      <h2 className="auth-title">Create Account</h2>
      
      {error && <div className="auth-error">{getErrorMessage()}</div>}

      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label className="auth-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            className="auth-input"
            placeholder="John Doe"
            value={userData.fullName}
            onChange={handleChange}
            disabled={isPending}
          />
          {validationErrors.fullName && <span className="validation-error">{validationErrors.fullName}</span>}
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Email</label>
          <input
            type="email"
            name="email"
            className="auth-input"
            placeholder="john@example.com"
            value={userData.email}
            onChange={handleChange}
            disabled={isPending}
          />
          {validationErrors.email && <span className="validation-error">{validationErrors.email}</span>}
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Phone Number</label>
          <input
            type="text"
            name="phone"
            className="auth-input"
            placeholder="9876543210"
            value={userData.phone}
            onChange={handleChange}
            disabled={isPending}
          />
          {validationErrors.phone && <span className="validation-error">{validationErrors.phone}</span>}
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Password</label>
          <input
            type="password"
            name="password"
            className="auth-input"
            placeholder="Strong password"
            value={userData.password}
            onChange={handleChange}
            disabled={isPending}
          />
          {validationErrors.password && <span className="validation-error">{validationErrors.password}</span>}
        </div>

        <button type="submit" className="auth-button" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
          {isPending ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div className="auth-link">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};

export default RegisterForm;
