import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintApi } from '../api/complaintApi';

export const useMyComplaints = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['myComplaints', page, size],
    queryFn: () => complaintApi.getMyComplaints(page, size),
  });
};

export const usePublicComplaints = (params = {}, userId = null) => {
  return useQuery({
    queryKey: ['publicComplaints', params, userId],
    queryFn: () => complaintApi.getAllComplaints(params),
    keepPreviousData: true,
  });
};

export const useToggleUpvote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => complaintApi.toggleUpvote(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['publicComplaints'] });
      await queryClient.cancelQueries({ queryKey: ['myComplaints'] });
    }
  });
};
