import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unreadCount'],
    queryFn: async () => {
      const response = await api.get('/notifications/unread-count');
      return response.data.data;
    },
    enabled: !!user,
  });

  // Fetch paginated history
  const getNotifications = async ({ pageParam = 0 }) => {
    const response = await api.get(`/notifications?page=${pageParam}&size=20`);
    return response.data.data; // Page<NotificationResponse>
  };

  const notificationsQuery = useQuery({
    queryKey: ['notifications', 'history'],
    queryFn: () => getNotifications({ pageParam: 0 }),
    enabled: !!user,
  });

  // Mark as read
  const markAsRead = useMutation({
    mutationFn: async (id) => {
      await api.put(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  // Mark all as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      await api.put('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  // SSE setup
  useEffect(() => {
    if (!user) return;

    let eventSource;
    let reconnectTimeout;
    
    const connectSSE = () => {
      const token = user.accessToken;
      eventSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/notifications/stream?token=${token}`, {
        withCredentials: true
      });

      eventSource.addEventListener('NOTIFICATION', (event) => {
        const newNotification = JSON.parse(event.data);
        toast.success(newNotification.title + ": " + newNotification.message.substring(0, 30) + "...", {
          icon: '🔔',
          duration: 5000,
        });
        
        // Invalidate queries to refresh lists and counts
        queryClient.invalidateQueries(['notifications']);
      });

      eventSource.onerror = (err) => {
        console.error('SSE connection error, attempting reconnect...');
        eventSource.close();
        reconnectTimeout = setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [user, queryClient]);

  return {
    unreadCount,
    notificationsQuery,
    markAsRead,
    markAllAsRead,
  };
};
