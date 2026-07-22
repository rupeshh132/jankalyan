import api from './axiosInstance';

export const adminApi = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  
  getAllComplaints: async (page = 0, size = 10, status = null) => {
    const params = new URLSearchParams({ page, size });
    if (status) params.append('status', status);
    
    const response = await api.get(`/admin/complaints?${params.toString()}`);
    return response.data;
  },
  
  updateComplaintStatus: async (complaintId, statusData) => {
    // Expected format { status: "RESOLVED", adminNote: "Fixed" }
    const response = await api.patch(`/admin/complaints/${complaintId}/status`, statusData);
    return response.data;
  },
  
  deleteComplaint: async (complaintId) => {
    const response = await api.delete(`/admin/complaints/${complaintId}`);
    return response.data;
  }
};
