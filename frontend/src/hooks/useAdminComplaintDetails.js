import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export const useAdminComplaintDetails = (complaintId) => {
  return useQuery({
    queryKey: ['adminComplaintDetails', complaintId],
    queryFn: () => adminApi.getComplaintDetails(complaintId),
    enabled: !!complaintId,
  });
};
