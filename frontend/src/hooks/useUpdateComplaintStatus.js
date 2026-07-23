import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import toast from 'react-hot-toast';

export const useUpdateComplaintStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ complaintId, status, remarks }) => 
      adminApi.updateComplaintStatus(complaintId, { status, remarks }),
    onSuccess: (data, variables) => {
      toast.success('Status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['adminComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminComplaintDetails', variables.complaintId] });
      queryClient.invalidateQueries({ queryKey: ['complaint', variables.complaintId] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  });
};
