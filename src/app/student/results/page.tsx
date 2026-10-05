"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  GraduationCap,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import { useMyCgpa, useMyResults } from "@/features/result/result.hooks";
import type {
  Result,
  ResultExamType,
} from "@/features/result/result.types";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

function getGradeBadgeClass(grade: string | null) {
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

function formatNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return "0";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return String(value);
  }

  return Number.isInteger(number)
    ? String(number)
    : number.toFixed(2);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
}

function ResultsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-3 p-6">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-2 h-4 w-64" />
        </CardHeader>

        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="space-y-3 rounded-xl border p-4"
            >
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

interface CourseResultGroup {
  key: string;
  semesterId: string;
  semesterName: string;
  semesterCode: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  results: Result[];
}

function groupResultsByCourse(results: Result[]) {
  const groups = new Map<string, CourseResultGroup>();

  for (const result of results) {
    const offering = result.exam.section.courseOffering;
    const course = offering.course;
    const semester = offering.semester;

    const key = `${semester.id}:${course.id}`;

    const existing = groups.get(key);

    if (existing) {
      existing.results.push(result);
      continue;
    }

    groups.set(key, {
      key,
      semesterId: semester.id,
      semesterName: semester.name,
      semesterCode: semester.code,
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.title,
      credits: Number(offering.credits),
      results: [result],
    });
  }

  return Array.from(groups.values());
}

function CourseResultCard({
  course,
}: {
  course: CourseResultGroup;
}) {
  const totalObtained = course.results.reduce(
    (total, result) => total + Number(result.marksObtained),
    0,
  );

  const totalMarks = course.results.reduce(
    (total, result) => total + Number(result.exam.totalMarks),
    0,
  );

  const percentage =
    totalMarks > 0
      ? (totalObtained / totalMarks) * 100
      : 0;

  const finalResult =
    course.results.find(
      (result) => result.exam.examType === "FINAL",
    ) ?? course.results[course.results.length - 1];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {course.courseCode}
              </Badge>

              <Badge variant="secondary">
                {course.credits}{" "}
                {course.credits === 1 ? "Credit" : "Credits"}
              </Badge>
            </div>

            <CardTitle className="mt-3 text-lg">
              {course.courseTitle}
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {course.semesterName} · {course.semesterCode}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                Grade
              </p>

              <p className="text-2xl font-bold">
                {finalResult?.grade ?? "—"}
              </p>
            </div>

            <Badge
              variant="outline"
              className={getGradeBadgeClass(
                finalResult?.grade ?? null,
              )}
            >
              {finalResult?.gradePoint !== null &&
              finalResult?.gradePoint !== undefined
                ? `${formatNumber(finalResult.gradePoint)} GP`
                : "Pending"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid gap-4 border-b p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Total Marks
            </p>

            <p className="mt-1 text-lg font-semibold">
              {formatNumber(totalObtained)} /{" "}
              {formatNumber(totalMarks)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Percentage
            </p>

            <p className="mt-1 text-lg font-semibold">
              {percentage.toFixed(2)}%
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Exams
            </p>

            <p className="mt-1 text-lg font-semibold">
              {course.results.length}
            </p>
          </div>
        </div>

        <div className="divide-y">
          {course.results.map((result) => (
            <div
              key={result.id}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {formatExamType(result.exam.examType)}
                  </Badge>

                  <span className="text-sm text-muted-foreground">
                    {formatDate(result.exam.examDate)}
                  </span>
                </div>

                <p className="mt-2 font-medium">
                  {result.exam.title}
                </p>

                {result.remarks && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {result.remarks}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="grid grid-cols-3 gap-5 text-right">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Marks
                    </p>

                    <p className="mt-1 font-semibold">
                      {formatNumber(result.marksObtained)}
                      {" / "}
                      {formatNumber(result.exam.totalMarks)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Grade
                    </p>

                    <p className="mt-1 font-semibold">
                      {result.grade ?? "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      GP
                    </p>

                    <p className="mt-1 font-semibold">
                      {formatNumber(result.gradePoint)}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/student/results/${result.id}`}
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  View Details
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentResultsPage() {
  const {
    data: resultsData,
    isLoading: resultsLoading,
    isError: resultsError,
    error: resultsErrorObject,
    refetch: refetchResults,
    isFetching: resultsFetching,
  } = useMyResults({
    page: 1,
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const {
    data: cgpaData,
    isLoading: cgpaLoading,
    isError: cgpaError,
    refetch: refetchCgpa,
    isFetching: cgpaFetching,
  } = useMyCgpa();

  const results = resultsData?.items ?? [];

  const courseGroups = useMemo(
    () => groupResultsByCourse(results),
    [results],
  );

  const semesterCount = useMemo(() => {
    return new Set(
      courseGroups.map((course) => course.semesterId),
    ).size;
  }, [courseGroups]);

  const totalCredits = useMemo(() => {
    const uniqueCourses = new Map<string, number>();

    for (const course of courseGroups) {
      uniqueCourses.set(
        course.key,
        course.credits,
      );
    }

    return Array.from(uniqueCourses.values()).reduce(
      (total, credits) => total + credits,
      0,
    );
  }, [courseGroups]);

  const handleRefresh = async () => {
    await Promise.all([
      refetchResults(),
      refetchCgpa(),
    ]);
  };

  const isLoading =
    resultsLoading || cgpaLoading;

  const isFetching =
    resultsFetching || cgpaFetching;

  if (isLoading) {
    return (
      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="mt-2 h-4 w-72" />
          </div>

          <Skeleton className="h-10 w-24" />
        </div>

        <ResultsPageSkeleton />
      </main>
    );
  }

  if (resultsError) {
    return (
      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Results
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View your published academic results and GPA information.
          </p>
        </div>

        <Alert variant="destructive">
          <AlertTitle>
            Unable to load results
          </AlertTitle>

          <AlertDescription>
            {resultsErrorObject instanceof Error
              ? resultsErrorObject.message
              : "Something went wrong while loading your results."}
          </AlertDescription>
        </Alert>

        <Button
          variant="outline"
          onClick={() => refetchResults()}
          disabled={resultsFetching}
        >
          <RefreshCw
            className={
              resultsFetching
                ? "size-4 animate-spin"
                : "size-4"
            }
          />
          Try Again
        </Button>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="size-6" />

            <h1 className="text-2xl font-bold tracking-tight">
              Results
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            View your published academic results, grades, and GPA information.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/student"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw
              className={
                isFetching
                  ? "size-4 animate-spin"
                  : "size-4"
              }
            />
            Refresh
          </Button>
        </div>
      </div>

      {cgpaError && (
        <Alert>
          <AlertTitle>
            CGPA is currently unavailable
          </AlertTitle>

          <AlertDescription>
            Your published results are available below, but the cumulative
            GPA could not be calculated right now.
          </AlertDescription>
        </Alert>
      )}

      {results.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-80 flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <Award className="size-7 text-muted-foreground" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No published results yet
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Your published exam results will appear here once they are
              released by the university.
            </p>

            <Link
              href="/student"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Back to Dashboard
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Current CGPA
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight">
                      {cgpaData
                        ? Number(cgpaData.cgpa).toFixed(2)
                        : "—"}
                    </p>
                  </div>

                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                    <TrendingUp className="size-5 text-primary" />
                  </div>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  Based on published course results.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Completed Credits
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight">
                      {cgpaData
                        ? formatNumber(cgpaData.totalCredits)
                        : formatNumber(totalCredits)}
                    </p>
                  </div>

                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="size-5 text-primary" />
                  </div>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  Credits represented in your published results.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Result Overview
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight">
                      {courseGroups.length}
                    </p>
                  </div>

                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                    <Award className="size-5 text-primary" />
                  </div>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  Courses across {semesterCount}{" "}
                  {semesterCount === 1 ? "semester" : "semesters"}.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Academic Results
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Your published results grouped by course and semester.
              </p>
            </div>

            <div className="space-y-4">
              {courseGroups.map((course) => (
                <CourseResultCard
                  key={course.key}
                  course={course}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}