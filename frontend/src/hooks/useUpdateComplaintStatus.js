import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';

export const useUpdateComplaintStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.updateComplaintStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
};
