"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Plus,
  Users,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useMyEnrollments } from "@/features/enrollment/enrollment.hooks";
import type { Enrollment } from "@/features/enrollment/enrollment.types";

export default function StudentCoursesPage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useMyEnrollments({
    page: 1,
    limit: 50,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  if (isLoading) {
    return <CoursesPageSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader />

        <Alert variant="destructive">
          <AlertCircle className="size-4" />

          <AlertTitle>
            Unable to load your courses
          </AlertTitle>

          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading your enrolled courses."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const enrollments = data?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader />

      <CourseSummary enrollments={enrollments} />

      {enrollments.length === 0 ? (
        <EmptyCourses />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {enrollments.map((enrollment) => (
            <EnrollmentCard
              key={enrollment.id}
              enrollment={enrollment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">
          Student Portal
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          My Courses
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          View your current course enrollments, sections,
          credits, and semester information.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/student"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
          <ArrowRight className="size-4" />
        </Link>

        <Link
          href="/student/courses/register"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Register Courses
        </Link>
      </div>
    </div>
  );
}

function CourseSummary({
  enrollments,
}: {
  enrollments: Enrollment[];
}) {
  const enrolledCourses = enrollments.filter(
    (enrollment) => enrollment.status === "ENROLLED",
  );

  const totalCredits = enrolledCourses.reduce(
    (total, enrollment) =>
      total +
      Number(
        enrollment.section.courseOffering.credits,
      ),
    0,
  );

  const currentSemester =
    enrolledCourses[0]?.section.courseOffering.semester;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">
            Active Courses
          </CardTitle>

          <BookOpen className="size-5 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <p className="text-2xl font-bold">
            {enrolledCourses.length}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Currently enrolled
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">
            Current Credits
          </CardTitle>

          <GraduationCap className="size-5 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <p className="text-2xl font-bold">
            {totalCredits}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Credits this semester
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">
            Semester
          </CardTitle>

          <CalendarDays className="size-5 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <p className="truncate text-lg font-semibold">
            {currentSemester?.name ?? "No active semester"}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {currentSemester?.code ?? "—"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function EnrollmentCard({
  enrollment,
}: {
  enrollment: Enrollment;
}) {
  const {
    section,
    status,
    enrolledAt,
  } = enrollment;

  const { courseOffering } = section;

  const course = courseOffering.course;
  const semester = courseOffering.semester;

  const isEnrolled = status === "ENROLLED";

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {course.code}
              </Badge>

              {isEnrolled && (
                <Badge variant="secondary">
                  <CheckCircle2 className="mr-1 size-3" />
                  Enrolled
                </Badge>
              )}

              {status !== "ENROLLED" && (
                <Badge variant="outline">
                  {formatStatus(status)}
                </Badge>
              )}
            </div>

            <CardTitle className="mt-3 line-clamp-2 text-lg">
              {course.title}
            </CardTitle>
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="size-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        <div className="grid grid-cols-2 gap-4">
          <InfoItem
            icon={GraduationCap}
            label="Credits"
            value={String(course.credits)}
          />

          <InfoItem
            icon={Users}
            label="Section"
            value={section.sectionCode}
          />

          <InfoItem
            icon={CalendarDays}
            label="Semester"
            value={semester.code}
          />

          <InfoItem
            icon={Users}
            label="Capacity"
            value={`${section.enrolledCount}/${section.capacity}`}
          />
        </div>

        <div className="rounded-xl border bg-muted/20 p-4">
          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Enrolled On
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(enrolledAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              Course Offering
            </p>

            <p className="mt-1 truncate text-sm font-medium">
              {courseOffering.code}
            </p>
          </div>

          <span className="truncate pl-4 text-xs text-muted-foreground">
            {section.name}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4 shrink-0" />

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}

function EmptyCourses() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BookOpen className="size-7" />
        </div>

        <h2 className="mt-5 text-lg font-semibold">
          No course enrollments yet
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          You do not currently have any course
          enrollments. Browse the available sections and
          register for your courses to see them here.
        </p>

        <Link
          href="/student/courses/register"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Register Courses
          <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

function CoursesPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Skeleton className="h-4 w-28" />

          <Skeleton className="mt-2 h-9 w-48" />

          <Skeleton className="mt-2 h-4 w-full max-w-xl" />
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-28" />
            </CardHeader>

            <CardContent>
              <Skeleton className="h-8 w-16" />

              <Skeleton className="mt-2 h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between gap-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-6 w-48" />
                </div>

                <Skeleton className="size-10 rounded-xl" />
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map(
                  (_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="space-y-2"
                    >
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ),
                )}
              </div>

              <Skeleton className="h-16 w-full rounded-xl" />

              <Skeleton className="h-5 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}