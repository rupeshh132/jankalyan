import api from './api';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  getComplaints: async (page = 0, size = 10) => {
    const response = await api.get('/admin/complaints', { params: { page, size } });
    return response.data;
  },
  updateComplaintStatus: async ({ complaintId, status, comments }) => {
    const response = await api.patch(`/admin/complaints/${complaintId}/status`, { status, comments });
    return response.data;
  },
  deleteComplaint: async (complaintId) => {
    const response = await api.delete(`/admin/complaints/${complaintId}`);
    return response.data;
  }
};
