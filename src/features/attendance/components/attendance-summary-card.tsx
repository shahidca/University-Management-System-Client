"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  GraduationCap,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useAttendanceSummary } from "@/features/attendance/attendance.hooks";

interface AttendanceSummaryCardProps {
  enrollmentId: string;
}

function getPercentageStatus(percentage: number) {
  if (percentage >= 75) {
    return {
      label: "Good Standing",
      variant: "default" as const,
      icon: CheckCircle2,
    };
  }

  if (percentage >= 60) {
    return {
      label: "Needs Attention",
      variant: "secondary" as const,
      icon: AlertCircle,
    };
  }

  return {
    label: "Low Attendance",
    variant: "destructive" as const,
    icon: XCircle,
  };
}

export function AttendanceSummaryCard({
  enrollmentId,
}: AttendanceSummaryCardProps) {
  const {
    data,
    isLoading,
    isError,
  } = useAttendanceSummary(enrollmentId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-2 h-4 w-32" />
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-20 w-full"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <CardContent className="flex min-h-32 items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Unable to load attendance summary.
          </p>
        </CardContent>
      </Card>
    );
  }

  const percentage = data.summary.attendancePercentage;

  const status = getPercentageStatus(percentage);

  const StatusIcon = status.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="text-primary size-5" />

              <CardTitle>
                {data.course.code}
              </CardTitle>
            </div>

            <p className="text-muted-foreground mt-1 text-sm">
              {data.course.title}
            </p>

            <p className="text-muted-foreground mt-1 text-xs">
              Section {data.section.sectionCode} ·{" "}
              {data.section.name}
            </p>
          </div>

          <Badge
            variant={status.variant}
            className="w-fit gap-1"
          >
            <StatusIcon className="size-3.5" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Main percentage */}
        <div className="rounded-xl border bg-muted/30 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-muted-foreground text-sm">
                Attendance Percentage
              </p>

              <p className="mt-1 text-3xl font-bold">
                {percentage.toFixed(2)}%
              </p>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-muted sm:max-w-64">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Total
              </p>

              <GraduationCap className="text-muted-foreground size-4" />
            </div>

            <p className="mt-2 text-2xl font-semibold">
              {data.summary.totalClasses}
            </p>

            <p className="text-muted-foreground text-xs">
              Classes
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Present
              </p>

              <CheckCircle2 className="text-muted-foreground size-4" />
            </div>

            <p className="mt-2 text-2xl font-semibold">
              {data.summary.present}
            </p>

            <p className="text-muted-foreground text-xs">
              Attended
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Late
              </p>

              <Clock3 className="text-muted-foreground size-4" />
            </div>

            <p className="mt-2 text-2xl font-semibold">
              {data.summary.late}
            </p>

            <p className="text-muted-foreground text-xs">
              Late arrivals
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Absent
              </p>

              <XCircle className="text-muted-foreground size-4" />
            </div>

            <p className="mt-2 text-2xl font-semibold">
              {data.summary.absent}
            </p>

            <p className="text-muted-foreground text-xs">
              Missed
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Excused
              </p>

              <AlertCircle className="text-muted-foreground size-4" />
            </div>

            <p className="mt-2 text-2xl font-semibold">
              {data.summary.excused}
            </p>

            <p className="text-muted-foreground text-xs">
              Excluded
            </p>
          </div>
        </div>

        {/* Calculation information */}
        <div className="text-muted-foreground rounded-lg border border-dashed p-3 text-xs">
          Attendance is calculated from{" "}
          <span className="font-medium">
            {data.summary.attendedClasses}
          </span>{" "}
          attended classes out of{" "}
          <span className="font-medium">
            {data.summary.countedClasses}
          </span>{" "}
          counted classes. Excused classes are excluded
          from the calculation.
        </div>
      </CardContent>
    </Card>
  );
}