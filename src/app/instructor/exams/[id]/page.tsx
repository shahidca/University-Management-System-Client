"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  RefreshCw,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useInstructorExam } from "@/features/instructor/instructor.hooks";
import type { InstructorExam } from "@/features/instructor/instructor.types";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(time: string | null) {
  if (!time) return null;

  const [hours, minutes] = time.split(":").map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return time;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getExamTypeLabel(
  examType: InstructorExam["examType"],
) {
  return (
    examType.charAt(0) +
    examType.slice(1).toLowerCase()
  );
}

function getEnrollmentPercentage(
  exam: InstructorExam,
) {
  const capacity = Number(
    exam.section.capacity ?? 0,
  );

  const enrolled = Number(
    exam.section.enrolledCount ?? 0,
  );

  if (!capacity) return 0;

  return Math.min(
    Math.round((enrolled / capacity) * 100),
    100,
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-md bg-muted p-2">
        <Icon className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}

function ExamDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-36" />

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-9 w-80 max-w-full" />
            <Skeleton className="h-5 w-64 max-w-full" />
          </div>

          <div className="grid gap-6 border-t pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="space-y-2"
                >
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-5 p-6">
            <Skeleton className="h-6 w-40" />

            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="space-y-2"
                >
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ),
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-6">
            <Skeleton className="h-6 w-40" />

            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="space-y-2"
                >
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ),
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function InstructorExamDetailsPage() {
  const params = useParams<{
    id: string;
  }>();

  const examId = params.id;

  const {
    data: exam,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useInstructorExam(examId);

  if (isLoading) {
    return <ExamDetailsSkeleton />;
  }

  if (isError || !exam) {
    return (
      <div className="space-y-6">
        <Link
          href="/instructor/exams"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Exams
        </Link>

        <Card>
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <FileText className="size-7 text-destructive" />
            </div>

            <h1 className="mt-4 text-xl font-semibold">
              Unable to load exam
            </h1>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              We couldn't retrieve this exam. It may
              have been removed or you may not have
              access to it.
            </p>

            <Button
              className="mt-6"
              onClick={() => void refetch()}
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
          </CardContent>
        </Card>
      </div>
    );
  }

  const course =
    exam.courseOffering?.course;

  const semester =
    exam.courseOffering?.semester;

  const enrollmentPercentage =
    getEnrollmentPercentage(exam);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/instructor"
          className="transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>

        <span>/</span>

        <Link
          href="/instructor/exams"
          className="transition-colors hover:text-foreground"
        >
          Exams
        </Link>

        <span>/</span>

        <span className="max-w-48 truncate text-foreground">
          {exam.title}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {getExamTypeLabel(exam.examType)}
            </Badge>

            <Badge
              variant={
                exam.isPublished
                  ? "default"
                  : "outline"
              }
            >
              {exam.isPublished
                ? "Published"
                : "Draft"}
            </Badge>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {exam.title}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {course?.code ?? "Course"}

            {course?.title
              ? ` • ${course.title}`
              : ""}

            {exam.section.sectionCode
              ? ` • Section ${exam.section.sectionCode}`
              : ""}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`size-4 ${
              isFetching ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* Exam Overview */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-b p-5 sm:border-r lg:border-b-0">
              <DetailItem
                icon={CalendarDays}
                label="Exam Date"
                value={formatDate(exam.examDate)}
              />
            </div>

            <div className="border-b p-5 lg:border-b-0 lg:border-r">
              <DetailItem
                icon={Clock3}
                label="Exam Time"
                value={
                  <>
                    {formatTime(exam.startTime) ??
                      "Not scheduled"}

                    {exam.endTime
                      ? ` – ${formatTime(
                          exam.endTime,
                        )}`
                      : ""}
                  </>
                }
              />
            </div>

            <div className="border-b p-5 sm:border-r sm:border-b-0">
              <DetailItem
                icon={FileText}
                label="Total Marks"
                value={`${exam.totalMarks} marks`}
              />
            </div>

            <div className="p-5">
              <DetailItem
                icon={MapPin}
                label="Room"
                value={
                  exam.room ?? "Not assigned"
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {exam.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Exam Description
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {exam.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Course & Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="size-5" />
              Course Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <p className="text-xs text-muted-foreground">
                Course Code
              </p>

              <p className="mt-1 font-medium">
                {course?.code ?? "Not available"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Course Title
              </p>

              <p className="mt-1 font-medium">
                {course?.title ??
                  exam.courseOffering?.title ??
                  "Not available"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Credits
              </p>

              <p className="mt-1 font-medium">
                {course?.credits ??
                  exam.courseOffering?.credits ??
                  "Not available"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Semester
              </p>

              <p className="mt-1 font-medium">
                {semester
                  ? `${semester.code} • ${semester.name}`
                  : "Not available"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="size-5" />
              Section Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <p className="text-xs text-muted-foreground">
                Section
              </p>

              <p className="mt-1 font-medium">
                {exam.section.sectionCode}

                {exam.section.name
                  ? ` • ${exam.section.name}`
                  : ""}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Enrollment
                  </p>

                  <p className="mt-1 font-medium">
                    {exam.section.enrolledCount ??
                      0}

                    {exam.section.capacity
                      ? ` / ${exam.section.capacity}`
                      : " students"}
                  </p>
                </div>

                <span className="text-sm font-semibold">
                  {enrollmentPercentage}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${enrollmentPercentage}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Section Status
              </p>

              <div className="mt-2">
                <Badge
                  variant={
                    exam.section.isActive
                      ? "default"
                      : "outline"
                  }
                >
                  {exam.section.isActive
                    ? "Active"
                    : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Academic Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">
                Exam Type
              </p>

              <p className="mt-1 font-medium">
                {getExamTypeLabel(exam.examType)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Publication Status
              </p>

              <div className="mt-2 flex items-center gap-2">
                {exam.isPublished && (
                  <CheckCircle2 className="size-4 text-primary" />
                )}

                <Badge
                  variant={
                    exam.isPublished
                      ? "default"
                      : "outline"
                  }
                >
                  {exam.isPublished
                    ? "Published"
                    : "Draft"}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Semester Code
              </p>

              <p className="mt-1 font-medium">
                {semester?.code ??
                  "Not available"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Semester Status
              </p>

              <p className="mt-1 font-medium">
                {semester?.status ??
                  "Not available"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back */}
      <div>
        <Link
          href="/instructor/exams"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to My Exams
        </Link>
      </div>
    </div>
  );
}