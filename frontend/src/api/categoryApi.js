import api from './axiosInstance';

export const categoryApi = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data.data;
  },
  
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  }
};
