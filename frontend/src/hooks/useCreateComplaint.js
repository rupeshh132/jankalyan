import { useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintService } from '../services/complaintService';
import { useNavigate } from 'react-router-dom';

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: complaintService.createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['publicComplaints'] });
      
      navigate('/dashboard/complaints');
    },
  });
};
