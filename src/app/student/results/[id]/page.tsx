"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useResult } from "@/features/result/result.hooks";
import type {
  Result,
  ResultExamType,
  ResultStatus,
} from "@/features/result/result.types";

const examTypeLabels: Record<ResultExamType, string> = {
  QUIZ: "Quiz",
  MIDTERM: "Midterm",
  FINAL: "Final",
  ASSIGNMENT: "Assignment",
  PRACTICAL: "Practical",
  VIVA: "Viva",
};

function formatExamType(type: ResultExamType) {
  return examTypeLabels[type] ?? type;
}

function formatNumber(
  value: number | string | null | undefined,
) {
  if (value === null || value === undefined) {
    return "—";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return String(value);
  }

  return Number.isInteger(number)
    ? String(number)
    : number.toFixed(2);
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatShortDate(
  value: string | null | undefined,
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
}

function formatTime(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const date = new Date(`1970-01-01T${value}`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getGradeBadgeClass(
  grade: string | null,
) {
  if (!grade) {
    return "";
  }

  if (["A+", "A", "A-"].includes(grade)) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
  }

  if (["B+", "B", "B-"].includes(grade)) {
    return "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400";
  }

  if (["C+", "C", "C-"].includes(grade)) {
    return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400";
  }

  if (["D", "F"].includes(grade)) {
    return "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400";
  }

  return "";
}

function getStatusLabel(status: ResultStatus) {
  switch (status) {
    case "DRAFT":
      return "Draft";

    case "SUBMITTED":
      return "Submitted";

    case "APPROVED":
      return "Approved";

    case "PUBLISHED":
      return "Published";

    case "REJECTED":
      return "Rejected";

    default:
      return status;
  }
}

function getStatusClass(status: ResultStatus) {
  switch (status) {
    case "PUBLISHED":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";

    case "APPROVED":
      return "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400";

    case "REJECTED":
      return "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400";

    case "SUBMITTED":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400";

    default:
      return "border-muted-foreground/20 bg-muted text-muted-foreground";
  }
}

function getPercentage(
  marksObtained: number | string,
  totalMarks: number | string,
) {
  const obtained = Number(marksObtained);
  const total = Number(totalMarks);

  if (
    Number.isNaN(obtained) ||
    Number.isNaN(total) ||
    total <= 0
  ) {
    return 0;
  }

  return (obtained / total) * 100;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{
    className?: string;
  }>;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}

function ResultDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <Card key={index}>
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ),
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>

          <CardContent className="space-y-6">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex gap-4"
                >
                  <Skeleton className="size-9 rounded-lg" />

                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-48" />
                  </div>
                </div>
              ),
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>

          <CardContent className="space-y-5">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="space-y-2"
                >
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-36" />
                </div>
              ),
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ResultDetails({
  result,
}: {
  result: Result;
}) {
  const router = useRouter();

  const course =
    result.exam.section.courseOffering.course;

  const semester =
    result.exam.section.courseOffering.semester;

  const courseOffering =
    result.exam.section.courseOffering;

  const percentage = getPercentage(
    result.marksObtained,
    result.exam.totalMarks,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 gap-2"
          onClick={() =>
            router.push("/student/results")
          }
        >
          <ArrowLeft className="size-4" />
          Back to Results
        </Button>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={getStatusClass(
                  result.status,
                )}
              >
                {result.status ===
                  "PUBLISHED" && (
                  <CheckCircle2 className="mr-1 size-3.5" />
                )}

                {getStatusLabel(
                  result.status,
                )}
              </Badge>

              <Badge variant="secondary">
                {formatExamType(
                  result.exam.examType,
                )}
              </Badge>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {result.exam.title}
              </h1>

              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {course.code} · {course.title}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full gap-2 sm:w-auto"
            onClick={() =>
              window.location.reload()
            }
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Result Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Marks Obtained
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight">
              {formatNumber(
                result.marksObtained,
              )}
              <span className="text-base font-medium text-muted-foreground">
                {" "}
                /{" "}
                {formatNumber(
                  result.exam.totalMarks,
                )}
              </span>
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Examination score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Percentage
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight">
              {percentage.toFixed(2)}%
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Based on total marks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Grade
            </p>

            <div className="mt-2 flex items-center gap-3">
              <p className="text-3xl font-bold tracking-tight">
                {result.grade ?? "—"}
              </p>

              {result.grade && (
                <Badge
                  variant="outline"
                  className={getGradeBadgeClass(
                    result.grade,
                  )}
                >
                  Grade
                </Badge>
              )}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Final academic grade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Grade Point
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight">
              {formatNumber(
                result.gradePoint,
              )}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Course grade point
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Result Information
            </CardTitle>

            <CardDescription>
              Detailed information about your
              published examination result.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <InfoRow
                icon={BookOpen}
                label="Course"
                value={`${course.code} — ${course.title}`}
              />

              <InfoRow
                icon={GraduationCap}
                label="Semester"
                value={`${semester.name} (${semester.code})`}
              />

              <InfoRow
                icon={FileText}
                label="Exam Type"
                value={formatExamType(
                  result.exam.examType,
                )}
              />

              <InfoRow
                icon={CalendarDays}
                label="Exam Date"
                value={formatDate(
                  result.exam.examDate,
                )}
              />

              <InfoRow
                icon={Clock3}
                label="Exam Time"
                value={`${formatTime(
                  result.exam.startTime,
                )} – ${formatTime(
                  result.exam.endTime,
                )}`}
              />

              <InfoRow
                icon={BookOpen}
                label="Course Credits"
                value={courseOffering.credits}
              />

              <InfoRow
                icon={GraduationCap}
                label="Section"
                value={`${result.exam.section.sectionCode} — ${result.exam.section.name}`}
              />

              <InfoRow
                icon={FileText}
                label="Total Marks"
                value={formatNumber(
                  result.exam.totalMarks,
                )}
              />

              <InfoRow
                icon={Award}
                label="Marks Obtained"
                value={formatNumber(
                  result.marksObtained,
                )}
              />

              <InfoRow
                icon={TrendingUp}
                label="Percentage"
                value={`${percentage.toFixed(
                  2,
                )}%`}
              />
            </div>

            <Separator />

            {/* Remarks */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />

                <h2 className="text-sm font-semibold">
                  Remarks
                </h2>
              </div>

              {result.remarks ? (
                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {result.remarks}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-4">
                  <p className="text-sm text-muted-foreground">
                    No remarks were provided for
                    this result.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Academic Context */}
        <Card>
          <CardHeader>
            <CardTitle>
              Academic Context
            </CardTitle>

            <CardDescription>
              Course and semester information.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Course Code
              </p>

              <p className="mt-1 font-semibold">
                {course.code}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Course Title
              </p>

              <p className="mt-1 font-semibold">
                {course.title}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Credits
              </p>

              <p className="mt-1 font-semibold">
                {courseOffering.credits}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Semester
              </p>

              <p className="mt-1 font-semibold">
                {semester.name}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {semester.code}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Section
              </p>

              <p className="mt-1 font-semibold">
                {result.exam.section.sectionCode}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {result.exam.section.name}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Result Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>
            Result Timeline
          </CardTitle>

          <CardDescription>
            Important processing and publication
            dates for this result.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <CalendarDays className="size-4 text-primary" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Created
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatShortDate(
                      result.createdAt,
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="size-4 text-primary" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Submitted
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatShortDate(
                      result.submittedAt,
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="size-4 text-primary" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Approved
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatShortDate(
                      result.approvedAt,
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <Award className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Published
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatShortDate(
                      result.publishedAt,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Navigation */}
      <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Result for {course.code} ·{" "}
          {formatShortDate(
            result.exam.examDate,
          )}
        </p>

        <Link
          href="/student/results"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Results
        </Link>
      </div>
    </div>
  );
}

export default function StudentResultDetailsPage() {
  const params = useParams<{
    id: string;
  }>();

  const resultId = params.id;

  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useResult(resultId);

  if (isLoading) {
    return (
      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        <ResultDetailsSkeleton />
      </main>
    );
  }

  if (isError || !result) {
    return (
      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <Alert variant="destructive">
            <AlertTitle>
              Unable to load result
            </AlertTitle>

            <AlertDescription className="mt-2 space-y-4">
              <p>
                {error instanceof Error
                  ? error.message
                  : "We could not load this result. Please try again."}
              </p>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() =>
                    void refetch()
                  }
                  disabled={isFetching}
                >
                  <RefreshCw
                    className={
                      isFetching
                        ? "size-4 animate-spin"
                        : "size-4"
                    }
                  />
                  Try Again
                </Button>

                <Link
                  href="/student/results"
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <ArrowLeft className="size-4" />
                  Back to Results
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      <ResultDetails result={result} />
    </main>
  );
}