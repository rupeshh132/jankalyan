import { useQuery } from '@tanstack/react-query';
import { complaintApi } from '../api/complaintApi';

export const useComplaintDetails = (id) => {
  return useQuery({
    queryKey: ['complaint', id],
    queryFn: () => complaintApi.getComplaintById(id),
    enabled: !!id,
  });
};
