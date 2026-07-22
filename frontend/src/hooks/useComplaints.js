import { useQuery } from '@tanstack/react-query';
import { complaintService } from '../services/complaintService';

export const useMyComplaints = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['myComplaints', page, size],
    queryFn: () => complaintService.getComplaints(page, size),
  });
};

export const usePublicComplaints = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['publicComplaints', page, size],
    queryFn: () => complaintService.getPublicComplaints(page, size),
  });
};
