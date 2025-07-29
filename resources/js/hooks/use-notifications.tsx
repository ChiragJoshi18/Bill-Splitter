import { useRealtimeNotifications } from './use-realtime-updates';

export function useNotifications() {
  const { unreadCount, refetch } = useRealtimeNotifications();
  return { unreadCount, refetch };
} 