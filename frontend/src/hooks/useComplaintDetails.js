import { useQuery } from '@tanstack/react-query';
import { complaintService } from '../services/complaintService';

export const useComplaintDetails = (id) => {
  return useQuery({
    queryKey: ['complaint', id],
    queryFn: () => complaintService.getComplaintDetails(id),
    enabled: !!id,
  });
};
