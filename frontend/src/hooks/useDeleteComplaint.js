import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';

export const useDeleteComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.deleteComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });
};
