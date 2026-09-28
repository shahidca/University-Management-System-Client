import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AuthGuard } from "@/features/auth/auth-guard";
import { USER_ROLES } from "@/constants/roles";

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({
  children,
}: StudentLayoutProps) {
  return (
    <AuthGuard allowedRoles={[USER_ROLES.STUDENT]}>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}