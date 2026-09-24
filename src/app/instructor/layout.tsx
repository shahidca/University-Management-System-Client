import type { ReactNode } from "react";

import { AuthGuard } from "@/features/auth/auth-guard";
import { USER_ROLES } from "@/constants/roles";

interface InstructorLayoutProps {
  children: ReactNode;
}

export default function InstructorLayout({
  children,
}: InstructorLayoutProps) {
  return (
    <AuthGuard
      allowedRoles={[USER_ROLES.INSTRUCTOR]}
    >
      {children}
    </AuthGuard>
  );
}