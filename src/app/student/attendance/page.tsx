"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useMyAttendance } from "@/features/attendance/attendance.hooks";
import { AttendanceSummaryCard } from "@/features/attendance/components/attendance-summary-card";
import type {
  AttendanceRecord,
  AttendanceStatus,
} from "@/features/attendance/attendance.types";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function getStatusVariant(status: AttendanceStatus) {
  switch (status) {
    case "PRESENT":
      return "default";

    case "ABSENT":
      return "destructive";

    case "LATE":
      return "secondary";

    case "EXCUSED":
      return "outline";

    default:
      return "outline";
  }
}

function getStatusIcon(status: AttendanceStatus) {
  switch (status) {
    case "PRESENT":
      return CheckCircle2;

    case "ABSENT":
      return XCircle;

    case "LATE":
      return Clock3;

    case "EXCUSED":
      return CalendarDays;

    default:
      return CalendarDays;
  }
}

function AttendanceRow({
  record,
}: {
  record: AttendanceRecord;
}) {
  const StatusIcon = getStatusIcon(record.status);

  return (
    <TableRow>
      <TableCell className="font-medium">
        {formatDate(record.date)}
      </TableCell>

      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">
            {record.enrollment.section.courseOffering.course.code}
          </span>

          <span className="text-muted-foreground text-sm">
            {record.enrollment.section.courseOffering.course.title}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">
            {record.enrollment.section.sectionCode}
          </span>

          <span className="text-muted-foreground text-sm">
            {record.enrollment.section.name}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <Badge
          variant={getStatusVariant(record.status)}
          className="gap-1"
        >
          <StatusIcon className="size-3.5" />
          {record.status}
        </Badge>
      </TableCell>

      <TableCell className="max-w-60">
        <span className="text-muted-foreground text-sm">
          {record.remarks || "—"}
        </span>
      </TableCell>
    </TableRow>
  );
}

function AttendanceTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-lg border p-4"
        >
          <Skeleton className="h-5 w-24" />

          <Skeleton className="h-10 flex-1" />

          <Skeleton className="h-10 w-32" />

          <Skeleton className="h-6 w-24" />

          <Skeleton className="h-5 w-32" />
        </div>
      ))}
    </div>
  );
}

export default function StudentAttendancePage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyAttendance({
    page: 1,
    limit: 100,
    sortBy: "date",
    sortOrder: "desc",
  });

  const records = data?.items ?? [];

  const statistics = useMemo(() => {
    const present = records.filter(
      (record) => record.status === "PRESENT",
    ).length;

    const late = records.filter(
      (record) => record.status === "LATE",
    ).length;

    const absent = records.filter(
      (record) => record.status === "ABSENT",
    ).length;

    const excused = records.filter(
      (record) => record.status === "EXCUSED",
    ).length;

    const countedClasses = present + late + absent;

    const attendedClasses = present + late;

    const percentage =
      countedClasses > 0
        ? Number(
            ((attendedClasses / countedClasses) * 100).toFixed(2),
          )
        : 0;

    return {
      total: records.length,
      present,
      late,
      absent,
      excused,
      countedClasses,
      attendedClasses,
      percentage,
    };
  }, [records]);

  /*
   * Each attendance record contains its enrollmentId.
   *
   * Multiple attendance records can belong to the same enrollment,
   * so we create a unique list before requesting course summaries.
   */
  const enrollmentIds = useMemo(() => {
    return Array.from(
      new Set(
        records.map(
          (record) => record.enrollmentId,
        ),
      ),
    );
  }, [records]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <GraduationCap className="text-primary size-5" />

            <span className="text-muted-foreground text-sm">
              Student Portal
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Attendance
          </h1>

          <p className="text-muted-foreground mt-1">
            View your attendance records and class participation.
          </p>
        </div>

        {/* Dashboard link */}
        <Link
          href="/student"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>
      </div>

      {/* Error */}
      {isError && (
        <Alert variant="destructive">
          <AlertTitle>
            Unable to load attendance
          </AlertTitle>

          <AlertDescription className="flex flex-col gap-3">
            <span>
              {error instanceof Error
                ? error.message
                : "Something went wrong while loading your attendance."}
            </span>

            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex h-9 w-fit items-center justify-center rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Try again
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Summary cards */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 w-28" />
              </CardHeader>

              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Overall attendance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Attendance
              </CardTitle>

              <GraduationCap className="text-muted-foreground size-4" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.percentage}%
              </div>

              <p className="text-muted-foreground text-xs">
                Overall attendance
              </p>
            </CardContent>
          </Card>

          {/* Present */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Present
              </CardTitle>

              <CheckCircle2 className="text-muted-foreground size-4" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.present}
              </div>

              <p className="text-muted-foreground text-xs">
                Classes attended
              </p>
            </CardContent>
          </Card>

          {/* Late */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Late
              </CardTitle>

              <Clock3 className="text-muted-foreground size-4" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.late}
              </div>

              <p className="text-muted-foreground text-xs">
                Late arrivals
              </p>
            </CardContent>
          </Card>

          {/* Absent */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Absent
              </CardTitle>

              <XCircle className="text-muted-foreground size-4" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.absent}
              </div>

              <p className="text-muted-foreground text-xs">
                Missed classes
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional statistics */}
      {!isLoading && !isError && records.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total records */}
              <div className="rounded-lg border p-4">
                <p className="text-muted-foreground text-sm">
                  Total Records
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {statistics.total}
                </p>
              </div>

              {/* Counted classes */}
              <div className="rounded-lg border p-4">
                <p className="text-muted-foreground text-sm">
                  Counted Classes
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {statistics.countedClasses}
                </p>
              </div>

              {/* Attended classes */}
              <div className="rounded-lg border p-4">
                <p className="text-muted-foreground text-sm">
                  Attended Classes
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {statistics.attendedClasses}
                </p>
              </div>

              {/* Excused */}
              <div className="rounded-lg border p-4">
                <p className="text-muted-foreground text-sm">
                  Excused
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {statistics.excused}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course-wise attendance */}
      {!isLoading && !isError && enrollmentIds.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Course Attendance
            </h2>

            <p className="text-muted-foreground mt-1 text-sm">
              View attendance performance for each enrolled
              course.
            </p>
          </div>

          <div className="space-y-4">
            {enrollmentIds.map((enrollmentId) => (
              <AttendanceSummaryCard
                key={enrollmentId}
                enrollmentId={enrollmentId}
              />
            ))}
          </div>
        </section>
      )}

      {/* Attendance records */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Attendance Records</CardTitle>

            <p className="text-muted-foreground mt-1 text-sm">
              Your latest attendance activity.
            </p>
          </div>

          {isFetching && !isLoading && (
            <Loader2 className="text-muted-foreground size-4 animate-spin" />
          )}
        </CardHeader>

        <CardContent>
          {/* Loading */}
          {isLoading ? (
            <AttendanceTableSkeleton />
          ) : isError ? null : records.length === 0 ? (
            /* Empty */
            <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
              <CalendarDays className="text-muted-foreground mb-3 size-10" />

              <h3 className="font-semibold">
                No attendance records
              </h3>

              <p className="text-muted-foreground mt-1 max-w-md text-sm">
                Attendance records will appear here once your
                instructor marks your class attendance.
              </p>
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>

                    <TableHead>Course</TableHead>

                    <TableHead>Section</TableHead>

                    <TableHead>Status</TableHead>

                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {records.map((record) => (
                    <AttendanceRow
                      key={record.id}
                      record={record}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}