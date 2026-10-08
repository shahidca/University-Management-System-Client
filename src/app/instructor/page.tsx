"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useMyInstructorProfile } from "@/features/instructor/instructor.hooks";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getInitials(
  firstName: string,
  lastName: string,
) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Skeleton className="size-20 rounded-full" />

            <div className="space-y-3">
              <Skeleton className="h-7 w-52" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>

          <CardContent className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-2 h-5 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>

          <CardContent className="space-y-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-2 h-5 w-48" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardError({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <UserRound className="size-6 text-destructive" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">
          Unable to load your instructor profile
        </h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          We could not retrieve your instructor profile.
          Please try again.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={onRetry}
        >
          <RefreshCw className="mr-2 size-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}

export default function InstructorDashboardPage() {
  const {
    data: instructor,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useMyInstructorProfile();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !instructor) {
    return (
      <DashboardError
        onRetry={() => void refetch()}
      />
    );
  }

  const fullName =
    `${instructor.firstName} ${instructor.lastName}`.trim();

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Instructor Portal
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {instructor.firstName}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your academic activities and instructor
            profile from one place.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`mr-2 size-4 ${
              isFetching ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* Profile hero */}
      <Card className="overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                {getInitials(
                  instructor.firstName,
                  instructor.lastName,
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-bold sm:text-2xl">
                    {fullName}
                  </h2>

                  <Badge
                    variant={
                      instructor.isActive
                        ? "default"
                        : "secondary"
                    }
                  >
                    {instructor.isActive
                      ? "Active"
                      : "Inactive"}
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {instructor.designation ||
                    "Instructor"}
                </p>

                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  Employee ID:{" "}
                  <span className="text-foreground">
                    {instructor.employeeId}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3">
              <ShieldCheck className="size-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Account Status
                </p>

                <p className="text-sm font-semibold">
                  {instructor.user.status}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main information */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BriefcaseBusiness className="size-5" />
              Professional Information
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 sm:grid-cols-2">
            <InfoItem
              icon={BriefcaseBusiness}
              label="Designation"
              value={
                instructor.designation ??
                "Not specified"
              }
            />

            <InfoItem
              icon={GraduationCap}
              label="Specialization"
              value={
                instructor.specialization ??
                "Not specified"
              }
            />

            <InfoItem
              icon={GraduationCap}
              label="Qualification"
              value={
                instructor.qualification ??
                "Not specified"
              }
            />

            <InfoItem
              icon={CalendarDays}
              label="Joining Date"
              value={formatDate(
                instructor.joiningDate,
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserRound className="size-5" />
              Contact Information
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5">
            <InfoItem
              icon={Mail}
              label="Email Address"
              value={instructor.user.email}
            />

            <InfoItem
              icon={Phone}
              label="Phone Number"
              value={
                instructor.phone ??
                "Not specified"
              }
            />

            <InfoItem
              icon={MapPin}
              label="Office Location"
              value={
                instructor.officeLocation ??
                "Not specified"
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Bio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="size-5" />
            About
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm leading-7 text-muted-foreground">
            {instructor.bio ||
              "No instructor biography has been added yet."}
          </p>
        </CardContent>
      </Card>

      {/* Account overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle2 className="size-5" />
            Account Overview
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem
            icon={UserRound}
            label="Full Name"
            value={fullName}
          />

          <InfoItem
            icon={BriefcaseBusiness}
            label="Employee ID"
            value={instructor.employeeId}
          />

          <InfoItem
            icon={ShieldCheck}
            label="Role"
            value={instructor.user.role}
          />

          <InfoItem
            icon={CalendarDays}
            label="Profile Created"
            value={formatDate(
              instructor.createdAt,
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}