import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export const useAdminComplaints = (page = 0, size = 10, status = null) => {
  return useQuery({
    queryKey: ['adminComplaints', page, size, status],
    queryFn: () => adminApi.getAllComplaints(page, size, status),
  });
};
