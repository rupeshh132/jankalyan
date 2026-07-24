import api from './axiosInstance';

export const statisticsApi = {
  getPublicStats: async () => {
    const response = await api.get('/statistics/public');
    return response.data.data;
  }
};
