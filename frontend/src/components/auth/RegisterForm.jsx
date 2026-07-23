import React, { useState } from 'react';
import { useRegister } from '../../hooks/useRegister';
import { Link } from 'react-router-dom';
import { UserPlus, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';

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
    <Card className="w-full backdrop-blur-xl bg-card/60 shadow-2xl border-white/10">
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{getErrorMessage()}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={userData.fullName}
              onChange={handleChange}
              disabled={isPending}
              className={`bg-background/50 ${validationErrors.fullName ? 'border-destructive' : ''}`}
            />
            {validationErrors.fullName && (
              <p className="text-sm text-destructive">{validationErrors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="john@example.com"
              value={userData.email}
              onChange={handleChange}
              disabled={isPending}
              className={`bg-background/50 ${validationErrors.email ? 'border-destructive' : ''}`}
            />
            {validationErrors.email && (
              <p className="text-sm text-destructive">{validationErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="text"
              name="phone"
              placeholder="9876543210"
              value={userData.phone}
              onChange={handleChange}
              disabled={isPending}
              className={`bg-background/50 ${validationErrors.phone ? 'border-destructive' : ''}`}
            />
            {validationErrors.phone && (
              <p className="text-sm text-destructive">{validationErrors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Strong password"
              value={userData.password}
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
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            {isPending ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border/50 pt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
