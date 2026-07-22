import api from './api';

export const complaintService = {
  getComplaints: async (page = 0, size = 10) => {
    const response = await api.get('/users/me/complaints', { params: { page, size } });
    return response.data;
  },
  getPublicComplaints: async (page = 0, size = 10) => {
    const response = await api.get('/complaints', { params: { page, size } });
    return response.data;
  },
  createComplaint: async (complaintData) => {
    const response = await api.post('/complaints', complaintData);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  getComplaintDetails: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  }
};
