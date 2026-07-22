import { useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintApi } from '../api/complaintApi';
import { adminApi } from '../api/adminApi';
import toast from 'react-hot-toast';

export const useDeleteComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isAdmin }) => {
      if (isAdmin) return adminApi.deleteComplaint(id);
      return complaintApi.deleteComplaint(id);
    },
    onSuccess: () => {
      toast.success('Complaint deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['myComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['publicComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['adminComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete complaint');
    }
  });
};
