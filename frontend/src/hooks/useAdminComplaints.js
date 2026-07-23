import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export const useAdminComplaints = (page = 0, size = 10, search = '', categoryId = '', status = '', sort = 'createdAt,desc') => {
  return useQuery({
    queryKey: ['adminComplaints', page, size, search, categoryId, status, sort],
    queryFn: () => adminApi.getAllComplaints(page, size, search, categoryId, status, sort),
    keepPreviousData: true,
  });
};
