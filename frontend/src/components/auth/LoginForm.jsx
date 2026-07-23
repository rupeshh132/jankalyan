import React, { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { Link } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';

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
    <Card className="w-full backdrop-blur-xl bg-card/60 shadow-2xl border-white/10">
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{getErrorMessage()}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={credentials.email}
              onChange={handleChange}
              disabled={isPending}
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
              disabled={isPending}
              className={`bg-background/50 ${validationErrors.password ? 'border-destructive' : ''}`}
            />
            {validationErrors.password && (
              <p className="text-sm text-destructive">{validationErrors.password}</p>
            )}
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 h-4 w-4" />
            )}
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
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
