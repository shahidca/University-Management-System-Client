import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteMyNotification,
  getMyNotificationById,
  getMyNotifications,
  getMyUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notification.service";

import type { NotificationListQuery } from "./notification.types";

export const notificationQueryKeys = {
  all: ["notifications"] as const,

  my: (query?: NotificationListQuery) =>
    [
      ...notificationQueryKeys.all,
      "my",
      query,
    ] as const,

  unreadCount: () =>
    [
      ...notificationQueryKeys.all,
      "unread-count",
    ] as const,

  detail: (id: string) =>
    [
      ...notificationQueryKeys.all,
      "detail",
      id,
    ] as const,
};

export function useMyNotifications(
  query?: NotificationListQuery,
) {
  return useQuery({
    queryKey:
      notificationQueryKeys.my(query),
    queryFn: () =>
      getMyNotifications(query),
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useMyUnreadCount() {
  return useQuery({
    queryKey:
      notificationQueryKeys.unreadCount(),
    queryFn: getMyUnreadCount,
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useMyNotification(
  id: string,
) {
  return useQuery({
    queryKey:
      notificationQueryKeys.detail(id),
    queryFn: () =>
      getMyNotificationById(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: string,
    ) => markNotificationAsRead(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          notificationQueryKeys.all,
      });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      markAllNotificationsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          notificationQueryKeys.all,
      });
    },
  });
}

export function useDeleteMyNotification() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: string,
    ) => deleteMyNotification(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          notificationQueryKeys.all,
      });
    },
  });
}