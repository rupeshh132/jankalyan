import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voteApi } from '../api/voteApi';
import toast from 'react-hot-toast';

export const useVote = (complaintId) => {
  const queryClient = useQueryClient();

  const upvoteMutation = useMutation({
    mutationFn: () => voteApi.upvote(complaintId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaint', complaintId] });
      queryClient.invalidateQueries({ queryKey: ['publicComplaints'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to vote');
    }
  });

  const removeVoteMutation = useMutation({
    mutationFn: () => voteApi.removeVote(complaintId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaint', complaintId] });
      queryClient.invalidateQueries({ queryKey: ['publicComplaints'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove vote');
    }
  });

  return {
    upvote: upvoteMutation.mutate,
    removeVote: removeVoteMutation.mutate,
    isLoading: upvoteMutation.isPending || removeVoteMutation.isPending
  };
};
