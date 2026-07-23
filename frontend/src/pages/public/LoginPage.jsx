import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Premium Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-500/5 -z-10" />
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
