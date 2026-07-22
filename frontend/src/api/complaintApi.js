import api from './axiosInstance';

export const complaintApi = {
  getAllComplaints: async (paramsObj = {}) => {
    const { page = 0, size = 10, categoryId = null, status = null, search = null, sort = null } = paramsObj;
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    if (categoryId) params.append('categoryId', categoryId);
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);
    
    const response = await api.get(`/complaints?${params.toString()}`);
    return response.data;
  },
  
  getMyComplaints: async (page = 0, size = 10) => {
    const params = new URLSearchParams({ page, size });
    const response = await api.get(`/complaints/my?${params.toString()}`);
    return response.data;
  },
  
  getComplaintById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },
  
  createComplaint: async (complaintData) => {
    const response = await api.post('/complaints', complaintData);
    return response.data;
  },
  
  deleteComplaint: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },
  
  uploadImages: async (complaintId, imageFiles) => {
    const formData = new FormData();
    Array.from(imageFiles).forEach(file => {
      formData.append('images', file);
    });
    
    const response = await api.post(`/complaints/${complaintId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  deleteImage: async (imageId) => {
    const response = await api.delete(`/complaints/images/${imageId}`);
    return response.data;
  }
};
