"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  RefreshCw,
  Timer,
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

import { useExam } from "@/features/exam/exam.hooks";
import type { Exam, ExamType } from "@/features/exam/exam.types";

function formatExamType(type: ExamType) {
  switch (type) {
    case "MIDTERM":
      return "Midterm";

    case "FINAL":
      return "Final";

    case "QUIZ":
      return "Quiz";

    case "ASSIGNMENT":
      return "Assignment";

    case "PRACTICAL":
      return "Practical";

    case "VIVA":
      return "Viva";

    default:
      return type;
  }
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
}

function formatShortDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}

function formatTime(time: string) {
  if (!time) {
    return "—";
  }

  const parsedDate = new Date(`1970-01-01T${time}`);

  if (Number.isNaN(parsedDate.getTime())) {
    return time;
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
}

function getExamStatus(exam: Exam) {
  if (!exam.isPublished) {
    return {
      label: "Not Published",
      className:
        "border-muted-foreground/20 bg-muted text-muted-foreground",
    };
  }

  const examDate = new Date(exam.date);

  if (Number.isNaN(examDate.getTime())) {
    return {
      label: "Published",
      className:
        "border-primary/20 bg-primary/10 text-primary",
    };
  }

  const now = new Date();

  const start = new Date(
    `${exam.date}T${exam.startTime}`,
  );

  const end = new Date(
    `${exam.date}T${exam.endTime}`,
  );

  if (now < start) {
    return {
      label: "Upcoming",
      className:
        "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    };
  }

  if (now >= start && now <= end) {
    return {
      label: "In Progress",
      className:
        "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }

  return {
    label: "Completed",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
}

function getExamDuration(
  startTime: string,
  endTime: string,
) {
  const start = new Date(
    `1970-01-01T${startTime}`,
  );

  const end = new Date(
    `1970-01-01T${endTime}`,
  );

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return "—";
  }

  const difference =
    (end.getTime() - start.getTime()) / 60000;

  if (difference <= 0) {
    return "—";
  }

  const hours = Math.floor(
    difference / 60,
  );

  const minutes = difference % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

function ExamInfoRow({
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

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />

        <Skeleton className="h-9 w-2/3 max-w-xl" />

        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <Card key={index}>
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-4 w-24" />

                <Skeleton className="h-7 w-32" />

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
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4"
                >
                  <Skeleton className="size-10 rounded-full" />

                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />

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
                  <Skeleton className="h-3 w-20" />

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

function ExamDetails({
  exam,
}: {
  exam: Exam;
}) {
  const router = useRouter();

  const status = getExamStatus(exam);

  const course =
    exam.section.courseOffering.course;

  const semester =
    exam.section.courseOffering.semester;

  const courseOffering =
    exam.section.courseOffering;

  const duration = getExamDuration(
    exam.startTime,
    exam.endTime,
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
            router.push("/student/exams")
          }
        >
          <ArrowLeft className="size-4" />
          Back to Exams
        </Button>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={status.className}
              >
                {status.label}
              </Badge>

              <Badge variant="secondary">
                {formatExamType(exam.type)}
              </Badge>

              {exam.isPublished && (
                <Badge
                  variant="outline"
                  className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle2 className="mr-1 size-3.5" />
                  Published
                </Badge>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {exam.title}
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

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Exam Date
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {formatShortDate(exam.date)}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(exam.date).split(",")[0]}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-2.5">
                <CalendarDays className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Exam Time
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {formatTime(exam.startTime)}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  to {formatTime(exam.endTime)}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-2.5">
                <Clock3 className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Marks
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {exam.totalMarks}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Passing: {exam.passingMarks}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-2.5">
                <FileText className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Duration
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {duration}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Scheduled examination
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-2.5">
                <Timer className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Exam Information
            </CardTitle>

            <CardDescription>
              Complete information about this
              examination.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <ExamInfoRow
                icon={BookOpen}
                label="Course"
                value={`${course.code} — ${course.title}`}
              />

              <ExamInfoRow
                icon={GraduationCap}
                label="Semester"
                value={`${semester.name} (${semester.code})`}
              />

              <ExamInfoRow
                icon={FileText}
                label="Exam Type"
                value={formatExamType(exam.type)}
              />

              <ExamInfoRow
                icon={BookOpen}
                label="Course Credits"
                value={courseOffering.credits}
              />

              <ExamInfoRow
                icon={GraduationCap}
                label="Section"
                value={`${exam.section.sectionCode} — ${exam.section.name}`}
              />

              <ExamInfoRow
                icon={BookOpen}
                label="Offering"
                value={`${courseOffering.code} — ${courseOffering.title}`}
              />

              <ExamInfoRow
                icon={CalendarDays}
                label="Exam Date"
                value={formatDate(exam.date)}
              />

              <ExamInfoRow
                icon={Clock3}
                label="Time"
                value={`${formatTime(exam.startTime)} – ${formatTime(exam.endTime)}`}
              />

              <ExamInfoRow
                icon={FileText}
                label="Marks"
                value={`${exam.totalMarks} total · ${exam.passingMarks} passing`}
              />
            </div>

            <Separator />

            {/* Instructions */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />

                <h2 className="text-sm font-semibold">
                  Instructions
                </h2>
              </div>

              {exam.instructions ? (
                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {exam.instructions}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-4">
                  <p className="text-sm text-muted-foreground">
                    No special instructions have
                    been provided for this
                    examination.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exam Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>
              Exam Schedule
            </CardTitle>

            <CardDescription>
              Your examination timeline.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="relative space-y-6">
              <div className="absolute left-[15px] top-3 h-[calc(100%-24px)] w-px bg-border" />

              <div className="relative flex gap-4">
                <div className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
                  <CalendarDays className="size-4 text-primary" />
                </div>

                <div className="pt-0.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(exam.date)}
                  </p>
                </div>
              </div>

              <div className="relative flex gap-4">
                <div className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
                  <Clock3 className="size-4 text-primary" />
                </div>

                <div className="pt-0.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Start Time
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatTime(exam.startTime)}
                  </p>
                </div>
              </div>

              <div className="relative flex gap-4">
                <div className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
                  <Timer className="size-4 text-primary" />
                </div>

                <div className="pt-0.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Duration
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {duration}
                  </p>
                </div>
              </div>

              <div className="relative flex gap-4">
                <div className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
                  <CheckCircle2 className="size-4 text-primary" />
                </div>

                <div className="pt-0.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    End Time
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatTime(exam.endTime)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Context */}
      <Card>
        <CardHeader>
          <CardTitle>
            Academic Context
          </CardTitle>

          <CardDescription>
            Course and section information for this
            examination.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Course Code
              </p>

              <p className="mt-1 font-semibold">
                {course.code}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Course Title
              </p>

              <p className="mt-1 font-semibold">
                {course.title}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Section
              </p>

              <p className="mt-1 font-semibold">
                {exam.section.sectionCode}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Semester
              </p>

              <p className="mt-1 font-semibold">
                {semester.code}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Navigation */}
      <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Exam scheduled for{" "}
          {formatShortDate(exam.date)}.
        </p>

        <Link
          href="/student/exams"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Exams
        </Link>
      </div>
    </div>
  );
}

export default function StudentExamDetailsPage() {
  const params = useParams<{
    id: string;
  }>();

  const examId = params.id;

  const {
    data: exam,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useExam(examId);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <DetailSkeleton />
      </main>
    );
  }

  if (isError || !exam) {
    return (
      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Alert variant="destructive">
            <AlertTitle>
              Unable to load exam
            </AlertTitle>

            <AlertDescription className="mt-2 space-y-4">
              <p>
                {error instanceof Error
                  ? error.message
                  : "We could not load this exam. Please try again."}
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
                    className={`size-4 ${
                      isFetching
                        ? "animate-spin"
                        : ""
                    }`}
                  />

                  Try Again
                </Button>

                <Link
                  href="/student/exams"
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <ArrowLeft className="size-4" />
                  Back to Exams
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <ExamDetails exam={exam} />
    </main>
  );
}