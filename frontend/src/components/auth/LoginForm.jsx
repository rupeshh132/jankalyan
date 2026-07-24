import React, { useState } from 'react';
import { useLogin, useGoogleLoginHook, useSendOtp, useVerifyOtp } from '../../hooks/useLogin';
import { Link } from 'react-router-dom';
import { LogIn, Loader2, Mail, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardFooter } from '../ui/card';
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

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-xl bg-card/60 shadow-2xl border-white/10">
      <CardContent className="pt-6">
        
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={credentialResponse => {
              googleLogin({ idToken: credentialResponse.credential });
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="flex space-x-2 mb-6 p-1 bg-muted/50 rounded-lg">
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'email' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="inline-block w-4 h-4 mr-2" />
            Email
          </button>
          <button
            onClick={() => setActiveTab('otp')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'otp' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Phone className="inline-block w-4 h-4 mr-2" />
            Phone (OTP)
          </button>
        </div>

        {getErrorMessage() && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{getErrorMessage()}</AlertDescription>
          </Alert>
        )}

        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="name@example.com"
                value={credentials.email}
                onChange={handleChange}
                disabled={isAnyPending}
                className={`bg-background/50 ${validationErrors.email ? 'border-destructive' : ''}`}
              />
              {validationErrors.email && (
                <p className="text-sm text-destructive">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                disabled={isAnyPending}
                className={`bg-background/50 ${validationErrors.password ? 'border-destructive' : ''}`}
              />
              {validationErrors.password && (
                <p className="text-sm text-destructive">{validationErrors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-6" disabled={isAnyPending}>
              {isLoginPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              {isLoginPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        )}

        {activeTab === 'otp' && (
          <div className="space-y-4">
            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="Enter your registered phone number"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (validationErrors.phone) setValidationErrors({ ...validationErrors, phone: '' });
                    }}
                    disabled={isAnyPending}
                    className={`bg-background/50 ${validationErrors.phone ? 'border-destructive' : ''}`}
                  />
                  {validationErrors.phone && (
                    <p className="text-sm text-destructive">{validationErrors.phone}</p>
                  )}
                </div>
                <Button type="submit" className="w-full mt-6" disabled={isAnyPending}>
                  {isOtpPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                  {isOtpPending ? 'Sending OTP...' : 'Send OTP to Email'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2 text-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    OTP sent to your registered email associated with {phone}
                  </p>
                  <button 
                    type="button" 
                    onClick={() => setIsOtpSent(false)} 
                    className="text-xs text-primary hover:underline"
                  >
                    Change Phone Number
                  </button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otpCode">Enter OTP</Label>
                  <Input
                    id="otpCode"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value);
                      if (validationErrors.otpCode) setValidationErrors({ ...validationErrors, otpCode: '' });
                    }}
                    disabled={isAnyPending}
                    className={`bg-background/50 text-center tracking-widest ${validationErrors.otpCode ? 'border-destructive' : ''}`}
                  />
                  {validationErrors.otpCode && (
                    <p className="text-sm text-destructive">{validationErrors.otpCode}</p>
                  )}
                </div>
                <Button type="submit" className="w-full mt-6" disabled={isAnyPending}>
                  {isVerifyPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                  {isVerifyPending ? 'Verifying...' : 'Verify & Login'}
                </Button>
              </form>
            )}
          </div>
        )}

      </CardContent>
      <CardFooter className="flex justify-center border-t border-border/50 pt-4">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Register here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
