import { apiRequest } from "@/services";

import type {
  DeleteNotificationResponse,
  MarkAllNotificationsAsReadResponse,
  Notification,
  NotificationListQuery,
  NotificationListResponse,
  NotificationUnreadCountResponse,
} from "./notification.types";

export function getMyNotifications(
  query?: NotificationListQuery,
): Promise<NotificationListResponse> {
  return apiRequest<NotificationListResponse>({
    method: "GET",
    url: "/notifications",
    params: query,
  });
}

export function getMyUnreadCount(): Promise<NotificationUnreadCountResponse> {
  return apiRequest<NotificationUnreadCountResponse>({
    method: "GET",
    url: "/notifications/unread-count",
  });
}

export function getMyNotificationById(
  id: string,
): Promise<Notification> {
  return apiRequest<Notification>({
    method: "GET",
    url: `/notifications/${id}`,
  });
}

export function markNotificationAsRead(
  id: string,
): Promise<Notification> {
  return apiRequest<Notification>({
    method: "PATCH",
    url: `/notifications/${id}/read`,
  });
}

export function markAllNotificationsAsRead(): Promise<MarkAllNotificationsAsReadResponse> {
  return apiRequest<MarkAllNotificationsAsReadResponse>({
    method: "PATCH",
    url: "/notifications/read-all",
  });
}

export function deleteMyNotification(
  id: string,
): Promise<DeleteNotificationResponse> {
  return apiRequest<DeleteNotificationResponse>({
    method: "DELETE",
    url: `/notifications/${id}`,
  });
}