"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import {
  USER_ROLES,
  type UserRole,
} from "@/constants/roles";
import { useAuth } from "@/providers";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

function getDashboardRoute(role: UserRole) {
  switch (role) {
    case USER_ROLES.STUDENT:
      return ROUTES.STUDENT.DASHBOARD;

    case USER_ROLES.INSTRUCTOR:
      return ROUTES.INSTRUCTOR.DASHBOARD;

    case USER_ROLES.ADMIN:
      return ROUTES.ADMIN.DASHBOARD;

    default:
      return ROUTES.HOME;
  }
}

export function AuthGuard({
  children,
  allowedRoles,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    isLoading,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || !user) {
      const loginUrl = new URL(
        ROUTES.AUTH.LOGIN,
        window.location.origin,
      );

      loginUrl.searchParams.set(
        "redirect",
        pathname,
      );

      router.replace(loginUrl.toString());

      return;
    }

    if (
      allowedRoles &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(user.role)
    ) {
      router.replace(
        getDashboardRoute(user.role),
      );
    }
  }, [
    user,
    isLoading,
    isAuthenticated,
    pathname,
    router,
    allowedRoles,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />

          <p className="text-sm text-muted-foreground">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return null;
  }

  return children;
}