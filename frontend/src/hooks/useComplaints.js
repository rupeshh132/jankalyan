import { useQuery } from '@tanstack/react-query';
import { complaintApi } from '../api/complaintApi';

export const useMyComplaints = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['myComplaints', page, size],
    queryFn: () => complaintApi.getMyComplaints(page, size),
  });
};

export const usePublicComplaints = (params = {}) => {
  return useQuery({
    queryKey: ['publicComplaints', params],
    queryFn: () => complaintApi.getAllComplaints(params),
    keepPreviousData: true,
  });
};
