import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '../api/statisticsApi';

export const usePublicStatistics = () => {
  return useQuery({
    queryKey: ['publicStatistics'],
    queryFn: () => statisticsApi.getPublicStats(),
    staleTime: 60000, // 1 minute
  });
};
