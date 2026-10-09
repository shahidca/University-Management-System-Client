"use client";

import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  FileText,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { useMyExams } from "@/features/instructor/instructor.hooks";
import type { InstructorExam } from "@/features/instructor/instructor.types";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
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
  return examType.charAt(0) + examType.slice(1).toLowerCase();
}

function getEnrollmentPercentage(exam: InstructorExam) {
  const capacity = Number(exam.section.capacity ?? 0);
  const enrolled = Number(
    exam.section.enrolledCount ?? 0,
  );

  if (!capacity) return 0;

  return Math.min(
    Math.round((enrolled / capacity) * 100),
    100,
  );
}

function ExamCard({
  exam,
}: {
  exam: InstructorExam;
}) {
  const enrollmentPercentage =
    getEnrollmentPercentage(exam);

  const course =
    exam.courseOffering?.course;

  const semester =
    exam.courseOffering?.semester;

  return (
    <Card className="overflow-hidden border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-0">
        <div className="border-b border-border/60 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
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

              <h2 className="truncate text-lg font-semibold">
                {exam.title}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {course?.code ?? "Course"}{" "}
                {course?.title
                  ? `• ${course.title}`
                  : ""}
              </p>
            </div>

            <div className="shrink-0 rounded-lg border bg-muted/30 px-3 py-2 text-sm">
              <p className="font-medium">
                {exam.totalMarks} marks
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Exam Date
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(exam.examDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 size-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Time
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatTime(exam.startTime) ??
                  "Not scheduled"}

                {exam.endTime
                  ? ` – ${formatTime(exam.endTime)}`
                  : ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen className="mt-0.5 size-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Section
              </p>

              <p className="mt-1 text-sm font-medium">
                {exam.section.sectionCode}

                {exam.section.name
                  ? ` • ${exam.section.name}`
                  : ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="mt-0.5 size-4 text-muted-foreground" />

            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">
                Students
              </p>

              <p className="mt-1 text-sm font-medium">
                {exam.section.enrolledCount ?? 0}

                {exam.section.capacity
                  ? ` / ${exam.section.capacity}`
                  : ""}
              </p>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${enrollmentPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {(semester || exam.room) && (
          <div className="flex flex-col gap-2 border-t border-border/60 bg-muted/20 px-5 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              {semester
                ? `${semester.code} • ${semester.name}`
                : "Semester information unavailable"}
            </span>

            {exam.room && (
              <span>
                Room:{" "}
                <span className="font-medium text-foreground">
                  {exam.room}
                </span>
              </span>
            )}
          </div>
        )}

        {/* View Details */}
        <div className="flex justify-end border-t border-border/60 px-5 py-3">
          <Link
            href={`/instructor/exams/${exam.id}`}
            className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            View Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ExamSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-5 p-5">
        <div className="flex justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>

          <Skeleton className="h-10 w-20" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="space-y-2"
            >
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>

        <div className="flex justify-end border-t border-border/60 pt-3">
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function InstructorExamsPage() {
  const [search, setSearch] = useState("");

  const {
    data: exams = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useMyExams();

  const filteredExams = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    if (!normalizedSearch) {
      return exams;
    }

    return exams.filter((exam) => {
      const course =
        exam.courseOffering?.course;

      const semester =
        exam.courseOffering?.semester;

      const searchableText = [
        exam.title,
        exam.examType,
        exam.section.sectionCode,
        exam.section.name,
        course?.code,
        course?.title,
        semester?.code,
        semester?.name,
        exam.room,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        normalizedSearch,
      );
    });
  }, [exams, search]);

  const publishedCount = exams.filter(
    (exam) => exam.isPublished,
  ).length;

  const draftCount =
    exams.length - publishedCount;

  const totalStudents = exams.reduce(
    (total, exam) =>
      total +
      Number(
        exam.section.enrolledCount ?? 0,
      ),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/instructor"
              className="transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>

            <span>/</span>

            <span className="text-foreground">
              Exams
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Exams
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Manage and review exams created for your
            assigned sections.
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

      {/* Summary */}
      {!isLoading && !isError && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <FileText className="size-5 text-primary" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Exams
                  </p>

                  <p className="text-2xl font-bold">
                    {exams.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <CalendarDays className="size-5 text-primary" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Published
                  </p>

                  <p className="text-2xl font-bold">
                    {publishedCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <FileText className="size-5 text-primary" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Drafts
                  </p>

                  <p className="text-2xl font-bold">
                    {draftCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <Users className="size-5 text-primary" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Student Entries
                  </p>

                  <p className="text-2xl font-bold">
                    {totalStudents}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      {!isLoading &&
        !isError &&
        exams.length > 0 && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search exams, courses, sections..."
              className="pl-9"
            />
          </div>
        )}

      {/* Error */}
      {isError && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <FileText className="size-6 text-destructive" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              Unable to load exams
            </h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              We couldn't retrieve your instructor
              exams. Please try again.
            </p>

            <Button
              className="mt-5"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <ExamSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading &&
        !isError &&
        exams.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="rounded-full bg-muted p-4">
                <FileText className="size-7 text-muted-foreground" />
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                No exams found
              </h2>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                You don't have any exams associated with
                your assigned sections yet.
              </p>
            </CardContent>
          </Card>
        )}

      {/* Search empty */}
      {!isLoading &&
        !isError &&
        exams.length > 0 &&
        filteredExams.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <Search className="size-6 text-muted-foreground" />

              <h2 className="mt-4 font-semibold">
                No matching exams
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Try a different exam, course, section,
                or semester search.
              </p>
            </CardContent>
          </Card>
        )}

      {/* Exams */}
      {!isLoading &&
        !isError &&
        filteredExams.length > 0 && (
          <div className="space-y-4">
            {filteredExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
              />
            ))}
          </div>
        )}
    </div>
  );
}