"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

import { ROUTES } from "@/constants/routes";
import {
  USER_ROLES,
  type UserRole,
} from "@/constants/roles";
import { DashboardUserMenu } from "./dashboard-user-menu";



interface DashboardTopbarProps {
  role: UserRole;
  onMenuClick?: () => void;
}

function getNotificationRoute(role: UserRole) {
  switch (role) {
    case USER_ROLES.STUDENT:
      return ROUTES.STUDENT.NOTIFICATIONS;

    case USER_ROLES.ADMIN:
      return ROUTES.ADMIN.NOTIFICATIONS;

    case USER_ROLES.INSTRUCTOR:
      return ROUTES.INSTRUCTOR.DASHBOARD;

    default:
      return ROUTES.HOME;
  }
}

export function DashboardTopbar({
  role,
  onMenuClick,
}: DashboardTopbarProps) {
  const notificationRoute =
    getNotificationRoute(role);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>

        <div className="hidden sm:block">
          <p className="text-sm font-semibold">
            Dashboard
          </p>

          <p className="text-xs text-muted-foreground">
            Welcome back to UniCore
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <Link
          href={notificationRoute}
          aria-label="Notifications"
          className="relative inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="size-4" />

          <span
            aria-hidden="true"
            className="absolute right-2 top-2 size-1.5 rounded-full bg-primary"
          />
        </Link>

        <ThemeToggle />

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <DashboardUserMenu />
      </div>
    </header>
  );
}