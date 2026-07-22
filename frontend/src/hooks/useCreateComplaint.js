import { useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintApi } from '../api/complaintApi';
import toast from 'react-hot-toast';

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => complaintApi.createComplaint(data),
    onSuccess: () => {
      toast.success('Complaint created successfully!');
      queryClient.invalidateQueries({ queryKey: ['myComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['publicComplaints'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create complaint');
    }
  });
};
