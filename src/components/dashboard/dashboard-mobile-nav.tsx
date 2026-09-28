"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Receipt,
  School,
  Settings,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  ROUTES,
} from "@/constants/routes";

import {
  USER_ROLES,
  type UserRole,
} from "@/constants/roles";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface DashboardMobileNavProps {
  role: UserRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const navigationByRole: Record<
  UserRole,
  NavigationSection[]
> = {
  [USER_ROLES.STUDENT]: [
    {
      title: "Main",
      items: [
        {
          label: "Dashboard",
          href: ROUTES.STUDENT.DASHBOARD,
          icon: LayoutDashboard,
        },
        {
          label: "Courses",
          href: ROUTES.STUDENT.COURSES,
          icon: BookOpen,
        },
        {
          label: "Attendance",
          href: ROUTES.STUDENT.ATTENDANCE,
          icon: CalendarCheck,
        },
        {
          label: "Exams",
          href: ROUTES.STUDENT.EXAMS,
          icon: ClipboardList,
        },
        {
          label: "Results",
          href: ROUTES.STUDENT.RESULTS,
          icon: GraduationCap,
        },
      ],
    },
    {
      title: "Academic",
      items: [
        {
          label: "Transcript",
          href: ROUTES.STUDENT.TRANSCRIPT,
          icon: FileText,
        },
      ],
    },
    {
      title: "Finance",
      items: [
        {
          label: "Fees",
          href: ROUTES.STUDENT.FEES,
          icon: WalletCards,
        },
        {
          label: "Payments",
          href: ROUTES.STUDENT.PAYMENTS,
          icon: CreditCard,
        },
      ],
    },
  ],

  [USER_ROLES.INSTRUCTOR]: [
    {
      title: "Main",
      items: [
        {
          label: "Dashboard",
          href: ROUTES.INSTRUCTOR.DASHBOARD,
          icon: LayoutDashboard,
        },
        {
          label: "Sections",
          href: ROUTES.INSTRUCTOR.SECTIONS,
          icon: BookOpen,
        },
        {
          label: "Students",
          href: ROUTES.INSTRUCTOR.STUDENTS,
          icon: Users,
        },
        {
          label: "Attendance",
          href: ROUTES.INSTRUCTOR.ATTENDANCE,
          icon: CalendarCheck,
        },
        {
          label: "Exams",
          href: ROUTES.INSTRUCTOR.EXAMS,
          icon: ClipboardList,
        },
        {
          label: "Results",
          href: ROUTES.INSTRUCTOR.RESULTS,
          icon: GraduationCap,
        },
      ],
    },
  ],

  [USER_ROLES.ADMIN]: [
    {
      title: "Main",
      items: [
        {
          label: "Dashboard",
          href: ROUTES.ADMIN.DASHBOARD,
          icon: LayoutDashboard,
        },
        {
          label: "Students",
          href: ROUTES.ADMIN.STUDENTS,
          icon: GraduationCap,
        },
        {
          label: "Instructors",
          href: ROUTES.ADMIN.INSTRUCTORS,
          icon: Users,
        },
      ],
    },
    {
      title: "Academic",
      items: [
        {
          label: "Departments",
          href: ROUTES.ADMIN.DEPARTMENTS,
          icon: School,
        },
        {
          label: "Programs",
          href: ROUTES.ADMIN.PROGRAMS,
          icon: BookOpen,
        },
        {
          label: "Courses",
          href: ROUTES.ADMIN.COURSES,
          icon: FileText,
        },
        {
          label: "Semesters",
          href: ROUTES.ADMIN.SEMESTERS,
          icon: CalendarCheck,
        },
        {
          label: "Sections",
          href: ROUTES.ADMIN.SECTIONS,
          icon: ClipboardList,
        },
        {
          label: "Enrollments",
          href: ROUTES.ADMIN.ENROLLMENTS,
          icon: GraduationCap,
        },
      ],
    },
    {
      title: "Finance & System",
      items: [
        {
          label: "Fees",
          href: ROUTES.ADMIN.FEES,
          icon: WalletCards,
        },
        {
          label: "Payments",
          href: ROUTES.ADMIN.PAYMENTS,
          icon: CreditCard,
        },
        {
          label: "Notifications",
          href: ROUTES.ADMIN.NOTIFICATIONS,
          icon: Receipt,
        },
        {
          label: "Audit Logs",
          href: ROUTES.ADMIN.AUDIT_LOGS,
          icon: Settings,
        },
      ],
    },
  ],
};

export function DashboardMobileNav({
  role,
  open,
  onOpenChange,
}: DashboardMobileNavProps) {
  const pathname = usePathname();

  const sections = navigationByRole[role];

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        side="left"
        className="w-[280px] p-0 sm:w-[320px]"
      >
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="sr-only">
            Dashboard navigation
          </SheetTitle>

          <Link
            href={ROUTES.HOME}
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex size-9 items-center justify-center overflow-hidden rounded-xl border border-primary/10 bg-background">
              <Image
                src="/unicore-logo.svg"
                alt="UniCore"
                width={36}
                height={36}
                className="size-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                UniCore
              </p>

              <p className="truncate text-[10px] text-muted-foreground">
                University Management
              </p>
            </div>
          </Link>
        </SheetHeader>

        <nav className="h-[calc(100vh-73px)] overflow-y-auto px-3 py-5">
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.title}>
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70">
                  {section.title}
                </p>

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(
                        `${item.href}/`,
                      );

                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() =>
                          onOpenChange(false)
                        }
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <Icon className="size-4 shrink-0" />

                        <span className="truncate">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}