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
