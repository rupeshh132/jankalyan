import { useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintApi } from '../api/complaintApi';
import toast from 'react-hot-toast';

export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => complaintApi.updateComplaint(id, data),
    onSuccess: (response, variables) => {
      // Invalidate both the list and the specific complaint cache
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint', variables.id] });
      toast.success('Complaint updated successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update complaint';
      toast.error(message);
    }
  });
};
