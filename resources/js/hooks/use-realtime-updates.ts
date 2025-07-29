import { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';

interface RealtimeOptions {
  interval?: number; // milliseconds
  enabled?: boolean;
}

export function useRealtimeUpdates<T>(
  initialData: T,
  endpoint: string,
  options: RealtimeOptions = {}
) {
  const { interval = 30000, enabled = true } = options;
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const newData = await response.json();
        setData(newData);
      }
    } catch (error) {
      console.error('Failed to fetch real-time data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, enabled]);

  // Update local data when props change
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Set up polling
  useEffect(() => {
    if (!enabled) return;

    fetchData();
    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [fetchData, interval, enabled]);

  const updateData = useCallback((updater: (prev: T) => T) => {
    setData(updater);
  }, []);

  return {
    data,
    setData,
    updateData,
    isLoading,
    refetch: fetchData
  };
}

// Hook for optimistic updates with rollback
export function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (data: T, ...args: any[]) => T
) {
  const [data, setData] = useState<T>(initialData);
  const [originalData, setOriginalData] = useState<T>(initialData);

  useEffect(() => {
    setData(initialData);
    setOriginalData(initialData);
  }, [initialData]);

  const optimisticUpdate = useCallback((
    updateArgs: any[],
    apiCall: () => Promise<any>,
    onSuccess?: () => void,
    onError?: (error: any) => void
  ) => {
    // Store original data for rollback
    const currentData = data;
    
    // Apply optimistic update
    const updatedData = updateFn(data, ...updateArgs);
    setData(updatedData);

    // Make API call
    apiCall()
      .then(() => {
        onSuccess?.();
      })
      .catch((error) => {
        // Rollback on error
        setData(currentData);
        onError?.(error);
      });
  }, [data, updateFn]);

  return {
    data,
    optimisticUpdate
  };
}

// Hook for real-time notifications
export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/notifications/unread-count');
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    refetch: fetchNotifications
  };
} 