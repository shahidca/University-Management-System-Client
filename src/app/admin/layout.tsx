import type { ReactNode } from "react";

import { AuthGuard } from "@/features/auth/auth-guard";
import { USER_ROLES } from "@/constants/roles";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <AuthGuard
      allowedRoles={[USER_ROLES.ADMIN]}
    >
      {children}
    </AuthGuard>
  );
}