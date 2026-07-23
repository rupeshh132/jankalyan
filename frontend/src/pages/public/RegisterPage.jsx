import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Premium Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-background to-blue-500/5 -z-10" />
      
      <div className="w-full max-w-md py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join JanKalyan to improve your city</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
