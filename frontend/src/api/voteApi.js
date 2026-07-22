import api from './axiosInstance';

export const voteApi = {
  upvote: async (complaintId) => {
    const response = await api.post(`/complaints/${complaintId}/vote`);
    return response.data;
  },
  
  removeVote: async (complaintId) => {
    const response = await api.delete(`/complaints/${complaintId}/vote`);
    return response.data;
  },
  
  getVoteCount: async (complaintId) => {
    const response = await api.get(`/complaints/${complaintId}/vote-count`);
    return response.data;
  }
};
