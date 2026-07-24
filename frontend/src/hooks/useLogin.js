import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (data) => {
      login(data);
      toast.success('Logged in successfully!');
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    }
  });
};

export const useGoogleLoginHook = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authApi.googleLogin(data),
    onSuccess: (data) => {
      login(data);
      toast.success('Logged in with Google successfully!');
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Google login failed');
    }
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (data) => authApi.sendOtp(data),
    onSuccess: () => {
      toast.success('OTP sent to your registered email successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    }
  });
};

export const useVerifyOtp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authApi.verifyOtp(data),
    onSuccess: (data) => {
      login(data);
      toast.success('Logged in successfully via OTP!');
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    }
  });
};
