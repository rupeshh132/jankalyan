import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';

export const useAdminComplaints = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['adminComplaints', page, size],
    queryFn: () => adminService.getComplaints(page, size),
  });
};
