import type { ReactNode } from "react";

import { AuthGuard } from "@/features/auth/auth-guard";
import { USER_ROLES } from "@/constants/roles";

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({
  children,
}: StudentLayoutProps) {
  return (
    <AuthGuard
      allowedRoles={[USER_ROLES.STUDENT]}
    >
      {children}
    </AuthGuard>
  );
}