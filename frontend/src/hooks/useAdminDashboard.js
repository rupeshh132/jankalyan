import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: adminService.getDashboard,
  });
};
