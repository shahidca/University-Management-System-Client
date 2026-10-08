"use client";

import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  RefreshCw,
  Users,
  XCircle,
} from "lucide-react";

import { useMySections } from "@/features/instructor/instructor.hooks";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function formatNumber(value: number | string | undefined) {
  if (value === undefined) {
    return "0";
  }

  return Number(value).toLocaleString();
}

function getEnrollmentPercentage(
  enrolledCount: number | string | undefined,
  capacity: number | string | undefined,
) {
  const enrolled = Number(enrolledCount ?? 0);
  const total = Number(capacity ?? 0);

  if (!total) {
    return 0;
  }

  return Math.min(Math.round((enrolled / total) * 100), 100);
}

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function InstructorSectionsPage() {
  const {
    data: sections,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useMySections();

  const activeSections =
    sections?.filter((section) => section.isActive !== false) ?? [];

  const totalStudents = sections?.reduce(
    (total, section) =>
      total + Number(section.enrolledCount ?? 0),
    0,
  ) ?? 0;

  const totalCapacity = sections?.reduce(
    (total, section) =>
      total + Number(section.capacity ?? 0),
    0,
  ) ?? 0;

  const averageEnrollment =
    totalCapacity > 0
      ? Math.round((totalStudents / totalCapacity) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/instructor"
              className="transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>

            <ChevronRight className="size-4" />

            <span>My Sections</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Sections
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View and monitor the courses and sections assigned to you.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="w-full sm:w-auto"
        >
          <RefreshCw
            className={`mr-2 size-4 ${
              isFetching ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total Sections
              </p>

              <p className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-7 w-12" />
                ) : (
                  sections?.length ?? 0
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="size-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Active Sections
              </p>

              <p className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-7 w-12" />
                ) : (
                  activeSections.length
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <Users className="size-5 text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total Students
              </p>

              <p className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-7 w-12" />
                ) : (
                  formatNumber(totalStudents)
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
              <GraduationCap className="size-5 text-violet-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Enrollment
              </p>

              <p className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-7 w-12" />
                ) : (
                  `${averageEnrollment}%`
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error */}
      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="size-6 text-destructive" />
            </div>

            <h2 className="text-lg font-semibold">
              Unable to load your sections
            </h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              We couldn't retrieve your assigned sections right now.
              Please try again.
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-5"
              onClick={() => void refetch()}
            >
              <RefreshCw className="mr-2 size-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-5 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-7 w-64" />
                  </div>

                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>

                <Skeleton className="h-3 w-full" />

                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading &&
        !isError &&
        sections &&
        sections.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
                <BookOpen className="size-7 text-muted-foreground" />
              </div>

              <h2 className="text-lg font-semibold">
                No sections assigned
              </h2>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                You currently don't have any sections assigned to you.
                Assigned sections will appear here.
              </p>
            </CardContent>
          </Card>
        )}

      {/* Sections */}
      {!isLoading &&
        !isError &&
        sections &&
        sections.length > 0 && (
          <div className="grid gap-5 xl:grid-cols-2">
            {sections.map((section) => {
              const enrollmentPercentage =
                getEnrollmentPercentage(
                  section.enrolledCount,
                  section.capacity,
                );

              const enrolled = Number(
                section.enrolledCount ?? 0,
              );

              const capacity = Number(
                section.capacity ?? 0,
              );

              const course =
                section.courseOffering?.course;

              const semester =
                section.courseOffering?.semester;

              return (
                <Card
                  key={section.id}
                  className="group overflow-hidden transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">
                            {section.sectionCode}
                          </Badge>

                          {section.isActive !== false ? (
                            <Badge
                              variant="outline"
                              className="border-emerald-500/30 text-emerald-600"
                            >
                              <CheckCircle2 className="mr-1 size-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-muted-foreground/30 text-muted-foreground"
                            >
                              <XCircle className="mr-1 size-3" />
                              Inactive
                            </Badge>
                          )}
                        </div>

                        <CardTitle className="line-clamp-2 text-xl">
                          {course?.title ??
                            section.courseOffering?.title ??
                            section.name}
                        </CardTitle>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {course?.code ??
                            section.courseOffering?.code ??
                            "Course"}
                        </p>
                      </div>

                      <div className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 sm:flex">
                        <BookOpen className="size-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    {/* Course information */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border bg-muted/30 p-3">
                        <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <GraduationCap className="size-3.5" />
                          Semester
                        </div>

                        <p className="truncate text-sm font-medium">
                          {semester?.name ?? "—"}
                        </p>

                        {semester?.code && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {semester.code}
                          </p>
                        )}
                      </div>

                      <div className="rounded-xl border bg-muted/30 p-3">
                        <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <Clock3 className="size-3.5" />
                          Semester Status
                        </div>

                        <p className="text-sm font-medium">
                          {semester?.status ?? "—"}
                        </p>
                      </div>
                    </div>

                    {/* Enrollment */}
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-muted-foreground" />

                          <span className="text-sm font-medium">
                            Enrollment
                          </span>
                        </div>

                        <span className="text-sm font-semibold">
                          {formatNumber(enrolled)} /{" "}
                          {formatNumber(capacity)}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${enrollmentPercentage}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {enrollmentPercentage}% of available
                        capacity
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="grid gap-3 border-t pt-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Credits
                        </p>

                        <p className="mt-0.5 text-sm font-medium">
                          {section.courseOffering?.credits ??
                            "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Exams
                        </p>

                        <p className="mt-0.5 text-sm font-medium">
                          {section._count?.exams ?? 0}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Schedules
                        </p>

                        <p className="mt-0.5 text-sm font-medium">
                          {section._count?.schedules ?? 0}
                        </p>
                      </div>
                    </div>

                    {/* Dates */}
                    {semester && (
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="size-3.5" />
                          {formatDate(semester.startDate)}
                        </span>

                        <span>→</span>

                        <span>
                          {formatDate(semester.endDate)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
    </div>
  );
}