"use client";

import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  CreditCard,
  GraduationCap,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useAuth } from "@/providers/auth-provider";
import {
  useDeleteMyNotification,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useMyNotifications,
  useMyUnreadCount,
} from "@/features/notification/notification.hooks";
import type {
  Notification,
  NotificationType,
} from "@/features/notification/notification.types";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const notificationTypeOptions: {
  value: NotificationType | "ALL";
  label: string;
}[] = [
  { value: "ALL", label: "All notifications" },
  { value: "SYSTEM", label: "System" },
  { value: "ACADEMIC", label: "Academic" },
  { value: "FINANCE", label: "Finance" },
  { value: "ATTENDANCE", label: "Attendance" },
  { value: "EXAM", label: "Exam" },
  { value: "RESULT", label: "Result" },
  { value: "ENROLLMENT", label: "Enrollment" },
  { value: "PAYMENT", label: "Payment" },
  { value: "GENERAL", label: "General" },
];

function getNotificationIcon(
  type: NotificationType,
) {
  switch (type) {
    case "ACADEMIC":
    case "RESULT":
      return GraduationCap;

    case "FINANCE":
    case "PAYMENT":
      return CreditCard;

    case "ATTENDANCE":
      return UserCheck;

    case "EXAM":
      return Clock;

    case "SYSTEM":
    case "ENROLLMENT":
    case "GENERAL":
    default:
      return Bell;
  }
}

function getNotificationTypeLabel(
  type: NotificationType,
) {
  return type.charAt(0) + type.slice(1).toLowerCase();
}

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(value));
}

function getRelativeTime(
  value: string,
) {
  const date = new Date(value);
  const now = Date.now();
  const difference =
    now - date.getTime();

  const minute =
    60 * 1000;
  const hour =
    60 * minute;
  const day =
    24 * hour;

  if (difference < minute) {
    return "Just now";
  }

  if (difference < hour) {
    return `${Math.floor(difference / minute)}m ago`;
  }

  if (difference < day) {
    return `${Math.floor(difference / hour)}h ago`;
  }

  if (difference < 7 * day) {
    return `${Math.floor(difference / day)}d ago`;
  }

  return formatDate(value);
}

function NotificationCard({
  notification,
  onRead,
  onDelete,
  isReading,
  isDeleting,
}: {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  isReading: boolean;
  isDeleting: boolean;
}) {
  const Icon = getNotificationIcon(
    notification.type,
  );

  return (
    <Card
      className={
        notification.isRead
          ? "transition-colors"
          : "border-primary/30 bg-primary/[0.03] shadow-sm"
      }
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex gap-4">
          <div
            className={
              notification.isRead
                ? "flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
                : "flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
            }
          >
            <Icon className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold tracking-tight">
                    {notification.title}
                  </h3>

                  {!notification.isRead && (
                    <span className="size-2 rounded-full bg-primary" />
                  )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-[10px]"
                  >
                    {getNotificationTypeLabel(
                      notification.type,
                    )}
                  </Badge>

                  <span className="text-xs text-muted-foreground">
                    {getRelativeTime(
                      notification.createdAt,
                    )}
                  </span>
                </div>
              </div>

              {!notification.isRead && (
                <Badge className="w-fit shrink-0">
                  Unread
                </Badge>
              )}
            </div>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {notification.message}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {!notification.isRead && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isReading}
                  onClick={() =>
                    onRead(notification.id)
                  }
                >
                  {isReading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                  Mark as read
                </Button>
              )}

              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={isDeleting}
                onClick={() =>
                  onDelete(notification.id)
                }
              >
                {isDeleting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Delete
              </Button>

              <span
                className="ml-auto hidden text-xs text-muted-foreground sm:block"
                title={formatDate(
                  notification.createdAt,
                )}
              >
                {formatDate(
                  notification.createdAt,
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex gap-4">
          <Skeleton className="size-10 shrink-0 rounded-xl" />

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-16" />
            </div>

            <Skeleton className="h-4 w-full max-w-2xl" />
            <Skeleton className="h-4 w-3/4 max-w-xl" />

            <div className="flex gap-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentNotificationsPage() {
  const { user } = useAuth();

  const [search, setSearch] =
    useState("");

  const [searchValue, setSearchValue] =
    useState("");

  const [type, setType] =
    useState<NotificationType | "ALL">(
      "ALL",
    );

  const [readFilter, setReadFilter] =
    useState<
      "ALL" | "UNREAD" | "READ"
    >("ALL");

  const [readingId, setReadingId] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const query = useMemo(() => {
    const params: {
      page: number;
      limit: number;
      search?: string;
      type?: NotificationType;
      isRead?: boolean;
      sortOrder: "asc" | "desc";
    } = {
      page: 1,
      limit: 50,
      sortOrder: "desc",
    };

    if (search.trim()) {
      params.search =
        search.trim();
    }

    if (type !== "ALL") {
      params.type = type;
    }

    if (readFilter === "UNREAD") {
      params.isRead = false;
    }

    if (readFilter === "READ") {
      params.isRead = true;
    }

    return params;
  }, [
    search,
    type,
    readFilter,
  ]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyNotifications(query);

  const {
    data: unreadData,
    isLoading: isUnreadLoading,
  } = useMyUnreadCount();

  const markAsRead =
    useMarkNotificationAsRead();

  const markAllAsRead =
    useMarkAllNotificationsAsRead();

  const deleteNotification =
    useDeleteMyNotification();

  const notifications =
    data?.data ?? [];

  const unreadCount =
    unreadData?.unreadCount ?? 0;

  const handleSearch = () => {
    setSearch(searchValue);
  };

  const handleMarkAsRead = async (
    id: string,
  ) => {
    try {
      setReadingId(id);
      await markAsRead.mutateAsync(id);
    } finally {
      setReadingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync();
  };

  const handleDelete = async (
    id: string,
  ) => {
    try {
      setDeletingId(id);
      await deleteNotification.mutateAsync(
        id,
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/student"
              className="transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>

            <span>/</span>

            <span>Notifications</span>
          </div>

          <div className="mt-3">
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bell className="size-5" />
              </span>
              Notifications
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Stay updated with your academic,
              financial, and university activities.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={
                isFetching
                  ? "size-4 animate-spin"
                  : "size-4"
              }
            />
            Refresh
          </Button>

          <Button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={
              unreadCount === 0 ||
              markAllAsRead.isPending
            }
          >
            {markAllAsRead.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCheck className="size-4" />
            )}
            Mark all as read
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bell className="size-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Total notifications
                </p>

                <p className="text-2xl font-bold">
                  {isLoading
                    ? "—"
                    : data?.pagination.total ??
                      0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="size-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Unread
                </p>

                <p className="text-2xl font-bold">
                  {isUnreadLoading
                    ? "—"
                    : unreadCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hidden lg:block">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <CheckCheck className="size-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Read
                </p>

                <p className="text-2xl font-bold">
                  {isLoading
                    ? "—"
                    : Math.max(
                        0,
                        (data?.pagination.total ??
                          0) -
                          unreadCount,
                      )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Find notifications
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={searchValue}
                  onChange={(event) =>
                    setSearchValue(
                      event.target.value,
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter"
                    ) {
                      handleSearch();
                    }
                  }}
                  placeholder="Search notifications..."
                  className="pl-9"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>

            <select
              value={type}
              onChange={(event) =>
                setType(
                  event.target
                    .value as
                    | NotificationType
                    | "ALL",
                )
              }
              className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {notificationTypeOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>

            <select
              value={readFilter}
              onChange={(event) =>
                setReadFilter(
                  event.target
                    .value as
                    | "ALL"
                    | "UNREAD"
                    | "READ",
                )
              }
              className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="ALL">
                All status
              </option>

              <option value="UNREAD">
                Unread
              </option>

              <option value="READ">
                Read
              </option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {isError && (
        <Alert variant="destructive">
          <XCircle className="size-4" />

          <AlertTitle>
            Unable to load notifications
          </AlertTitle>

          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {error instanceof Error
                ? error.message
                : "Something went wrong while loading your notifications."}
            </span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <NotificationSkeleton
              key={index}
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading &&
        !isError &&
        notifications.length === 0 && (
          <Card>
            <CardContent className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Bell className="size-7" />
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                No notifications found
              </h2>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {search ||
                type !== "ALL" ||
                readFilter !== "ALL"
                  ? "Try changing your search or filters."
                  : "You're all caught up. New university updates will appear here."}
              </p>

              {(search ||
                type !== "ALL" ||
                readFilter !== "ALL") && (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearch("");
                    setSearchValue("");
                    setType("ALL");
                    setReadFilter("ALL");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

      {/* Notifications */}
      {!isLoading &&
        !isError &&
        notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map(
              (notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={
                    notification
                  }
                  onRead={
                    handleMarkAsRead
                  }
                  onDelete={
                    handleDelete
                  }
                  isReading={
                    readingId ===
                    notification.id
                  }
                  isDeleting={
                    deletingId ===
                    notification.id
                  }
                />
              ),
            )}
          </div>
        )}
    </div>
  );
}