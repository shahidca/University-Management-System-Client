"use client";

import {
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  useInstructorStudentAttendance,
  useInstructorStudentResults,
  useMyStudents,
} from "@/features/instructor/instructor.hooks";

export default function InstructorStudentDetailsPage() {
  const params =
    useParams<{ studentId: string }>();

  const studentId =
    params.studentId;

  const {
    data: students,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useMyStudents();

  const student =
    students?.find(
      (item) =>
        item.id === studentId,
    );

  const {
    attendanceSummaries,
    isLoading:
      isAttendanceLoading,
    isError:
      isAttendanceError,
    hasEnrollments,
    hasAttendance,
  } =
    useInstructorStudentAttendance(
      studentId,
    );

  const {
    studentResults,
    isLoading:
      isResultsLoading,
    isError:
      isResultsError,
    hasResults,
  } =
    useInstructorStudentResults(
      studentId,
    );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />

        <div className="h-10 w-64 animate-pulse rounded bg-muted" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-80 animate-pulse rounded-xl border bg-card" />

          <div className="h-80 animate-pulse rounded-xl border bg-card lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Link
          href="/instructor/students"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Students
        </Link>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-destructive/10 p-3 text-destructive">
              <AlertCircle className="size-6" />
            </div>

            <h1 className="mt-4 text-lg font-semibold">
              Unable to load student
            </h1>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Something went wrong while loading the
              student information.
            </p>

            <button
              type="button"
              onClick={() =>
                void refetch()
              }
              disabled={isFetching}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`size-4 ${
                  isFetching
                    ? "animate-spin"
                    : ""
                }`}
              />

              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="space-y-6">
        <Link
          href="/instructor/students"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Students
        </Link>

        <div className="rounded-xl border bg-card p-10 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-muted p-4">
              <UserRound className="size-7 text-muted-foreground" />
            </div>

            <h1 className="mt-4 text-xl font-semibold">
              Student not found
            </h1>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              This student is not available in your
              assigned sections.
            </p>

            <Link
              href="/instructor/students"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ArrowLeft className="size-4" />
              Back to Students
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fullName =
    `${student.firstName} ${student.lastName}`;

  /*
  |--------------------------------------------------------------------------
  | Attendance Calculations
  |--------------------------------------------------------------------------
  */

  const averageAttendance =
    attendanceSummaries.length > 0
      ? attendanceSummaries.reduce(
          (total, item) =>
            total +
            Number(
              item.summary
                .attendancePercentage,
            ),
          0,
        ) /
        attendanceSummaries.length
      : 0;

  const totalClasses =
    attendanceSummaries.reduce(
      (total, item) =>
        total +
        Number(
          item.summary.totalClasses,
        ),
      0,
    );

  const totalPresent =
    attendanceSummaries.reduce(
      (total, item) =>
        total +
        Number(
          item.summary.present,
        ),
      0,
    );

  const totalLate =
    attendanceSummaries.reduce(
      (total, item) =>
        total +
        Number(
          item.summary.late,
        ),
      0,
    );

  const totalAbsent =
    attendanceSummaries.reduce(
      (total, item) =>
        total +
        Number(
          item.summary.absent,
        ),
      0,
    );

  /*
  |--------------------------------------------------------------------------
  | Result Calculations
  |--------------------------------------------------------------------------
  */

  const publishedResults =
    studentResults.filter(
      (result) =>
        result.isPublished,
    );

  const totalExamMarks =
    studentResults.reduce(
      (total, result) =>
        total +
        Number(
          result.exam?.totalMarks ?? 0,
        ),
      0,
    );

  const obtainedExamMarks =
    studentResults.reduce(
      (total, result) =>
        total +
        Number(
          result.marksObtained,
        ),
      0,
    );

  const examPercentage =
    totalExamMarks > 0
      ? (obtainedExamMarks /
          totalExamMarks) *
        100
      : 0;

  const gradePoints =
    publishedResults
      .map(
        (result) =>
          result.gradePoint !==
          null
            ? Number(
                result.gradePoint,
              )
            : null,
      )
      .filter(
        (
          value,
        ): value is number =>
          value !== null &&
          !Number.isNaN(value),
      );

  const averageGradePoint =
    gradePoints.length > 0
      ? gradePoints.reduce(
          (total, value) =>
            total + value,
          0,
        ) /
        gradePoints.length
      : null;

  const getAttendanceStatus =
    (percentage: number) => {
      if (percentage >= 80) {
        return {
          label: "Good",
          className:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        };
      }

      if (percentage >= 70) {
        return {
          label: "Warning",
          className:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        };
      }

      return {
        label: "Critical",
        className:
          "bg-destructive/10 text-destructive",
      };
    };

  const formatExamDate = (
    date: string,
  ) => {
    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime(),
      )
    ) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/instructor"
            className="transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>

          <span>/</span>

          <Link
            href="/instructor/students"
            className="transition-colors hover:text-foreground"
          >
            Students
          </Link>

          <span>/</span>

          <span className="max-w-40 truncate text-foreground">
            {fullName}
          </span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/instructor/students"
              className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to Students
            </Link>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Student Details
            </h1>

            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              View academic, contact, attendance, and
              examination information for this student.
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
              student.isActive ===
              false
                ? "bg-muted text-muted-foreground"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            <CheckCircle2 className="size-4" />

            {student.isActive ===
            false
              ? "Inactive Student"
              : "Active Student"}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserRound className="size-9" />
            </div>

            <h2 className="mt-4 text-xl font-bold">
              {fullName}
            </h2>

            {student.studentId && (
              <p className="mt-1 text-sm text-muted-foreground">
                Student ID:{" "}
                {student.studentId}
              </p>
            )}
          </div>

          <div className="mt-6 border-t pt-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contact Information
            </p>

            <div className="space-y-4">
              {student.email && (
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <Mail className="size-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Email
                    </p>

                    <p className="mt-0.5 break-all text-sm font-medium">
                      {student.email}
                    </p>
                  </div>
                </div>
              )}

              {student.phone && (
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <Phone className="size-4 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Phone
                    </p>

                    <p className="mt-0.5 text-sm font-medium">
                      {student.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Academic information */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <BookOpen className="size-5" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Academic Information
                </h2>

                <p className="text-sm text-muted-foreground">
                  Current academic profile
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Program
                </p>

                <p className="mt-2 font-semibold">
                  {student.program?.name ??
                    "Not available"}
                </p>

                {student.program?.code && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {student.program.code}
                  </p>
                )}
              </div>

              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Degree
                </p>

                <p className="mt-2 font-semibold">
                  {student.program?.degree ??
                    "Not available"}
                </p>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4 sm:col-span-2">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 size-5 text-muted-foreground" />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Department
                    </p>

                    <p className="mt-2 font-semibold">
                      {student.department?.name ??
                        "Not available"}
                    </p>

                    {student.department?.code && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {
                          student
                            .department
                            .code
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructor relationship */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="font-semibold">
              Instructor Overview
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              This student is listed because they are
              enrolled in one or more sections assigned
              to you.
            </p>

            <div className="mt-5 rounded-lg border bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-600 dark:text-emerald-400" />

                <div>
                  <p className="font-medium">
                    Student is within your teaching
                    scope
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Academic information shown here is
                    based on the students assigned to
                    your instructor sections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Monitoring */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-semibold">
              Academic Monitoring
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Attendance and examination performance
              across your assigned sections.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {attendanceSummaries.length >
              0 && (
              <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {
                  attendanceSummaries.length
                }{" "}
                Course
                {attendanceSummaries.length !==
                1
                  ? "s"
                  : ""}
              </span>
            )}

            {studentResults.length >
              0 && (
              <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {
                  studentResults.length
                }{" "}
                Result
                {studentResults.length !==
                1
                  ? "s"
                  : ""}
              </span>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Attendance                                                      */}
        {/* -------------------------------------------------------------- */}

        <div className="mt-8 border-t pt-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Clock3 className="size-5" />
            </div>

            <div>
              <h3 className="font-semibold">
                Attendance Monitoring
              </h3>

              <p className="text-sm text-muted-foreground">
                Attendance overview across your assigned
                sections.
              </p>
            </div>
          </div>

          {/* Attendance loading */}
          {isAttendanceLoading && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({
                length: 4,
              }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-lg border bg-muted/30"
                  />
                ),
              )}
            </div>
          )}

          {/* Attendance error */}
          {!isAttendanceLoading &&
            isAttendanceError && (
              <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-destructive/10 p-2 text-destructive">
                    <AlertCircle className="size-5" />
                  </div>

                  <div>
                    <p className="font-medium">
                      Unable to load attendance
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      The student profile is available,
                      but attendance information could not
                      be retrieved.
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* No enrollment */}
          {!isAttendanceLoading &&
            !isAttendanceError &&
            !hasEnrollments && (
              <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
                  <BookOpen className="size-5 text-muted-foreground" />
                </div>

                <h3 className="mt-4 font-semibold">
                  No active enrollment found
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                  No enrollment was found for this student
                  in the sections currently assigned to
                  you.
                </p>
              </div>
            )}

          {/* Enrollment exists but no attendance */}
          {!isAttendanceLoading &&
            !isAttendanceError &&
            hasEnrollments &&
            !hasAttendance && (
              <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
                  <Clock3 className="size-5 text-muted-foreground" />
                </div>

                <h3 className="mt-4 font-semibold">
                  No attendance records yet
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                  Attendance has not been recorded for this
                  student's current sections yet.
                </p>
              </div>
            )}

          {/* Attendance summary */}
          {!isAttendanceLoading &&
            !isAttendanceError &&
            hasAttendance && (
              <>
                {/* Overall summary */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Average Attendance
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {averageAttendance.toFixed(
                        1,
                      )}
                      %
                    </p>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${
                          averageAttendance >=
                          80
                            ? "bg-emerald-500"
                            : averageAttendance >=
                                70
                              ? "bg-amber-500"
                              : "bg-destructive"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              averageAttendance,
                            ),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Total Classes
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {totalClasses}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Across monitored courses
                    </p>
                  </div>

                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Present
                    </p>

                    <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {totalPresent}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Attendance sessions
                    </p>
                  </div>

                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Absent / Late
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {totalAbsent +
                        totalLate}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {totalAbsent} absent ·{" "}
                      {totalLate} late
                    </p>
                  </div>
                </div>

                {/* Course attendance */}
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-semibold">
                      Attendance by Course
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Detailed attendance performance for
                      each section.
                    </p>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {attendanceSummaries.map(
                      (item) => {
                        const percentage =
                          Number(
                            item.summary
                              .attendancePercentage,
                          );

                        const status =
                          getAttendanceStatus(
                            percentage,
                          );

                        return (
                          <div
                            key={
                              item.enrollment
                                .id
                            }
                            className="rounded-xl border bg-background p-5"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                                    {
                                      item
                                        .course
                                        .code
                                    }
                                  </span>

                                  <span className="text-xs text-muted-foreground">
                                    {
                                      item
                                        .section
                                        .sectionCode
                                    }
                                  </span>
                                </div>

                                <h4 className="mt-2 font-semibold">
                                  {
                                    item
                                      .course
                                      .title
                                  }
                                </h4>

                                <p className="mt-1 text-sm text-muted-foreground">
                                  {
                                    item
                                      .course
                                      .offeringCode
                                  }{" "}
                                  ·{" "}
                                  {
                                    item
                                      .section
                                      .name
                                  }
                                </p>
                              </div>

                              <span
                                className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                              >
                                {
                                  status.label
                                }
                              </span>
                            </div>

                            <div className="mt-5">
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-muted-foreground">
                                  Attendance
                                </span>

                                <span className="text-lg font-bold">
                                  {percentage.toFixed(
                                    1,
                                  )}
                                  %
                                </span>
                              </div>

                              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    percentage >=
                                    80
                                      ? "bg-emerald-500"
                                      : percentage >=
                                          70
                                        ? "bg-amber-500"
                                        : "bg-destructive"
                                  }`}
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(
                                        0,
                                        percentage,
                                      ),
                                    )}%`,
                                  }}
                                />
                              </div>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                              <div className="rounded-lg bg-muted/40 p-3">
                                <p className="text-xs text-muted-foreground">
                                  Classes
                                </p>

                                <p className="mt-1 font-semibold">
                                  {
                                    item
                                      .summary
                                      .totalClasses
                                  }
                                </p>
                              </div>

                              <div className="rounded-lg bg-emerald-500/5 p-3">
                                <p className="text-xs text-muted-foreground">
                                  Present
                                </p>

                                <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                  {
                                    item
                                      .summary
                                      .present
                                  }
                                </p>
                              </div>

                              <div className="rounded-lg bg-amber-500/5 p-3">
                                <p className="text-xs text-muted-foreground">
                                  Late
                                </p>

                                <p className="mt-1 font-semibold text-amber-600 dark:text-amber-400">
                                  {
                                    item
                                      .summary
                                      .late
                                  }
                                </p>
                              </div>

                              <div className="rounded-lg bg-destructive/5 p-3">
                                <p className="text-xs text-muted-foreground">
                                  Absent
                                </p>

                                <p className="mt-1 font-semibold text-destructive">
                                  {
                                    item
                                      .summary
                                      .absent
                                  }
                                </p>
                              </div>
                            </div>

                            {Number(
                              item.summary
                                .excused,
                            ) >
                              0 && (
                              <div className="mt-3 rounded-lg bg-blue-500/5 p-3">
                                <p className="text-xs text-muted-foreground">
                                  Excused
                                </p>

                                <p className="mt-1 font-semibold text-blue-600 dark:text-blue-400">
                                  {
                                    item
                                      .summary
                                      .excused
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </>
            )}
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Examination Results                                             */}
        {/* -------------------------------------------------------------- */}

        <div className="mt-8 border-t pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <Award className="size-5" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Examination Results
                </h3>

                <p className="text-sm text-muted-foreground">
                  Exam marks, grades, and result history for
                  this student.
                </p>
              </div>
            </div>

            {hasResults && (
              <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {studentResults.length}{" "}
                Result
                {studentResults.length !==
                1
                  ? "s"
                  : ""}
              </span>
            )}
          </div>

          {/* Result loading */}
          {isResultsLoading && (
            <div className="mt-6 space-y-4">
              {Array.from({
                length: 3,
              }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-36 animate-pulse rounded-xl border bg-muted/30"
                  />
                ),
              )}
            </div>
          )}

          {/* Result error */}
          {!isResultsLoading &&
            isResultsError && (
              <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-destructive/10 p-2 text-destructive">
                    <AlertCircle className="size-5" />
                  </div>

                  <div>
                    <p className="font-medium">
                      Unable to load examination results
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      The student profile and attendance
                      information are available, but
                      examination results could not be
                      retrieved.
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* No results */}
          {!isResultsLoading &&
            !isResultsError &&
            !hasResults && (
              <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
                  <FileText className="size-5 text-muted-foreground" />
                </div>

                <h4 className="mt-4 font-semibold">
                  No examination results yet
                </h4>

                <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                  No examination result has been recorded
                  for this student in your assigned exams.
                </p>
              </div>
            )}

          {/* Result summary */}
          {!isResultsLoading &&
            !isResultsError &&
            hasResults && (
              <>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Exams
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {studentResults.length}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Recorded results
                    </p>
                  </div>

                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Published
                    </p>

                    <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {publishedResults.length}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Officially published
                    </p>
                  </div>

                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Marks
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {obtainedExamMarks.toFixed(
                        1,
                      )}
                      <span className="text-base font-medium text-muted-foreground">
                        {" "}
                        /{" "}
                        {totalExamMarks.toFixed(
                          1,
                        )}
                      </span>
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {examPercentage.toFixed(
                        1,
                      )}
                      % overall
                    </p>
                  </div>

                  <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Average Grade Point
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {averageGradePoint !==
                      null
                        ? averageGradePoint.toFixed(
                            2,
                          )
                        : "—"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Based on available results
                    </p>
                  </div>
                </div>

                {/* Result cards */}
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="font-semibold">
                      Result History
                    </h4>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Examination performance recorded for
                      this student.
                    </p>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {studentResults.map(
                      (result) => {
                        const marks =
                          Number(
                            result.marksObtained,
                          );

                        const totalMarks =
                          result.exam
                            ?.totalMarks !==
                          undefined
                            ? Number(
                                result.exam
                                  .totalMarks,
                              )
                            : 0;

                        const marksPercentage =
                          totalMarks >
                          0
                            ? (marks /
                                totalMarks) *
                              100
                            : null;

                        return (
                          <div
                            key={
                              result.id
                            }
                            className="rounded-xl border bg-background p-5"
                          >
                            <div className="flex flex-col gap-4">
                              {/* Result header */}
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    {result.exam?.examType && (
                                      <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                                        {
                                          result
                                            .exam
                                            .examType
                                        }
                                      </span>
                                    )}

                                    <span
                                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                        result.isPublished
                                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                      }`}
                                    >
                                      {result.isPublished
                                        ? "Published"
                                        : "Unpublished"}
                                    </span>
                                  </div>

                                  <h5 className="mt-3 text-base font-semibold">
                                    {result.exam
                                      ?.title ??
                                      "Examination Result"}
                                  </h5>

                                  <p className="mt-1 break-all text-xs text-muted-foreground">
                                    Exam ID:{" "}
                                    {
                                      result.examId
                                    }
                                  </p>
                                </div>

                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                  <Award className="size-6" />
                                </div>
                              </div>

                              {/* Exam information */}
                              <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-lg bg-muted/40 p-3">
                                  <p className="text-xs text-muted-foreground">
                                    Course
                                  </p>

                                  <p className="mt-1 font-medium">
                                    {result
                                      .exam
                                      ?.section
                                      ?.sectionCode ??
                                      "Not available"}
                                  </p>
                                </div>

                                <div className="rounded-lg bg-muted/40 p-3">
                                  <p className="text-xs text-muted-foreground">
                                    Exam Date
                                  </p>

                                  <p className="mt-1 font-medium">
                                    {result.exam
                                      ?.examDate
                                      ? formatExamDate(
                                          result
                                            .exam
                                            .examDate,
                                        )
                                      : "Not available"}
                                  </p>
                                </div>

                                <div className="rounded-lg bg-muted/40 p-3">
                                  <p className="text-xs text-muted-foreground">
                                    Section
                                  </p>

                                  <p className="mt-1 font-medium">
                                    {result.exam
                                      ?.section
                                      ?.name ??
                                      "Not available"}
                                  </p>
                                </div>
                              </div>

                              {/* Marks */}
                              <div className="rounded-xl border bg-card p-4">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                  <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                      Marks Obtained
                                    </p>

                                    <p className="mt-2 text-3xl font-bold">
                                      {marks.toFixed(
                                        1,
                                      )}

                                      {totalMarks >
                                        0 && (
                                        <span className="text-lg font-medium text-muted-foreground">
                                          {" "}
                                          /{" "}
                                          {totalMarks.toFixed(
                                            1,
                                          )}
                                        </span>
                                      )}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3 sm:min-w-48">
                                    <div className="rounded-lg bg-muted/40 p-3">
                                      <p className="text-xs text-muted-foreground">
                                        Grade
                                      </p>

                                      <p className="mt-1 text-lg font-bold">
                                        {result.grade ??
                                          "—"}
                                      </p>
                                    </div>

                                    <div className="rounded-lg bg-muted/40 p-3">
                                      <p className="text-xs text-muted-foreground">
                                        Grade Point
                                      </p>

                                      <p className="mt-1 text-lg font-bold">
                                        {result.gradePoint !==
                                        null
                                          ? Number(
                                              result.gradePoint,
                                            ).toFixed(
                                              2,
                                            )
                                          : "—"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {marksPercentage !==
                                  null && (
                                  <div className="mt-4">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground">
                                        Performance
                                      </span>

                                      <span className="font-medium">
                                        {marksPercentage.toFixed(
                                          1,
                                        )}
                                        %
                                      </span>
                                    </div>

                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                                      <div
                                        className={`h-full rounded-full ${
                                          marksPercentage >=
                                          80
                                            ? "bg-emerald-500"
                                            : marksPercentage >=
                                                60
                                              ? "bg-primary"
                                              : marksPercentage >=
                                                  40
                                                ? "bg-amber-500"
                                                : "bg-destructive"
                                        }`}
                                        style={{
                                          width: `${Math.min(
                                            100,
                                            Math.max(
                                              0,
                                              marksPercentage,
                                            ),
                                          )}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Remarks */}
                              {result.remarks && (
                                <div className="rounded-lg border bg-muted/20 p-4">
                                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Remarks
                                  </p>

                                  <p className="mt-2 text-sm leading-6">
                                    {
                                      result.remarks
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </>
            )}
        </div>
      </div>

      {/* Academic performance */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <Award className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              Academic Performance
            </h2>

            <p className="text-sm text-muted-foreground">
              Combined monitoring summary for this student.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Attendance
            </p>

            <p className="mt-2 text-2xl font-bold">
              {hasAttendance
                ? `${averageAttendance.toFixed(
                    1,
                  )}%`
                : "—"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Average across monitored courses
            </p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Exam Performance
            </p>

            <p className="mt-2 text-2xl font-bold">
              {hasResults
                ? `${examPercentage.toFixed(
                    1,
                  )}%`
                : "—"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Based on available exam marks
            </p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Grade Point
            </p>

            <p className="mt-2 text-2xl font-bold">
              {averageGradePoint !==
              null
                ? averageGradePoint.toFixed(
                    2,
                  )
                : "—"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Average available grade point
            </p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Published Results
            </p>

            <p className="mt-2 text-2xl font-bold">
              {publishedResults.length}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Officially published results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}