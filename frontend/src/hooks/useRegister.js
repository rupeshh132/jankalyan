import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData) => authApi.register(userData),
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  });
};
