import api from './axiosInstance';

export const adminApi = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data.data;
  },
  
  getAllComplaints: async (page = 0, size = 10, search = '', categoryId = '', status = '', sort = '') => {
    const params = new URLSearchParams({ page, size });
    if (search) params.append('search', search);
    if (categoryId) params.append('categoryId', categoryId);
    if (status) params.append('status', status);
    if (sort) params.append('sort', sort);
    
    const response = await api.get(`/admin/complaints?${params.toString()}`);
    return response.data.data;
  },
  
  getComplaintDetails: async (complaintId) => {
    const response = await api.get(`/admin/complaints/${complaintId}`);
    return response.data.data;
  },
  
  updateComplaintStatus: async (complaintId, statusData) => {
    // Expected format { status: "RESOLVED", remarks: "Fixed" }
    const response = await api.patch(`/admin/complaints/${complaintId}/status`, statusData);
    return response.data.data;
  },
  
  deleteComplaint: async (complaintId) => {
    const response = await api.delete(`/admin/complaints/${complaintId}`);
    return response.data.data;
  }
};
