"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { DashboardMobileNav } from "./dashboard-mobile-nav";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";

import { useAuth } from "@/providers";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({
  children,
}: DashboardShellProps) {
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <DashboardSidebar role={user.role} />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar
            role={user.role}
            onMenuClick={() =>
              setMobileMenuOpen(true)
            }
          />

          <main className="min-w-0 flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>

      <DashboardMobileNav
        role={user.role}
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
      />
    </div>
  );
}