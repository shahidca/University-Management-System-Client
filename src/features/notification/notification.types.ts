export type NotificationType =
  | "SYSTEM"
  | "ACADEMIC"
  | "FINANCE"
  | "ATTENDANCE"
  | "EXAM"
  | "RESULT"
  | "ENROLLMENT"
  | "PAYMENT"
  | "GENERAL";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationListResponse {
  data: Notification[];
  pagination: NotificationPagination;
}

export interface NotificationListQuery {
  page?: number;
  limit?: number;
  type?: NotificationType;
  isRead?: boolean;
  search?: string;
  sortOrder?: "asc" | "desc";
}

export interface NotificationUnreadCountResponse {
  unreadCount: number;
}

export interface MarkAllNotificationsAsReadResponse {
  updatedCount: number;
}

export interface DeleteNotificationResponse {
  id: string;
}