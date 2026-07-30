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
    onMutate: async (id) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['publicComplaints'] });
      await queryClient.cancelQueries({ queryKey: ['myComplaints'] });
      await queryClient.cancelQueries({ queryKey: ['complaint', id] });

      // Snapshot the previous values
      const previousPublic = queryClient.getQueriesData({ queryKey: ['publicComplaints'] });
      const previousMy = queryClient.getQueriesData({ queryKey: ['myComplaints'] });
      const previousDetails = queryClient.getQueryData(['complaint', id]);

      // Helper to optimistically update a list of complaints
      const updateListCache = (oldData) => {
        if (!oldData || !oldData.content) return oldData;
        return {
          ...oldData,
          content: oldData.content.map(c => {
            if (c.id === id) {
              const isUpvoted = c.isUpvotedByCurrentUser;
              return {
                ...c,
                isUpvotedByCurrentUser: !isUpvoted,
                upvoteCount: isUpvoted ? Math.max(0, (c.upvoteCount || 1) - 1) : (c.upvoteCount || 0) + 1
              };
            }
            return c;
          })
        };
      };

      // Optimistically update lists
      queryClient.setQueriesData({ queryKey: ['publicComplaints'] }, updateListCache);
      queryClient.setQueriesData({ queryKey: ['myComplaints'] }, updateListCache);

      // Optimistically update details
      if (previousDetails?.data) {
        const isUpvoted = previousDetails.data.isUpvotedByCurrentUser;
        queryClient.setQueryData(['complaint', id], {
          ...previousDetails,
          data: {
            ...previousDetails.data,
            isUpvotedByCurrentUser: !isUpvoted,
            upvoteCount: isUpvoted ? Math.max(0, (previousDetails.data.upvoteCount || 1) - 1) : (previousDetails.data.upvoteCount || 0) + 1
          }
        });
      }

      return { previousPublic, previousMy, previousDetails };
    },
    onError: (err, id, context) => {
      if (context?.previousPublic) {
        context.previousPublic.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousMy) {
        context.previousMy.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetails) {
        queryClient.setQueryData(['complaint', id], context.previousDetails);
      }
    },
    onSettled: (data, error, id) => {
      queryClient.invalidateQueries({ queryKey: ['publicComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['myComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
    }
  });
};
