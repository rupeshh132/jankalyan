import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/userApi';
import toast from 'react-hot-toast';

export const useProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => userApi.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => userApi.updateProfile(data),
    onSuccess: (response) => {
      queryClient.setQueryData(['userProfile'], response);
      toast.success(response.message || 'Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
    },
  });
};

export const useUploadProfilePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file) => userApi.uploadProfilePhoto(file),
    onSuccess: (response) => {
      queryClient.setQueryData(['userProfile'], response);
      toast.success('Profile photo uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload photo. Please try again.');
    },
  });
};
