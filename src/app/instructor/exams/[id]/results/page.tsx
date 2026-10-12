"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileText,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useInstructorExam,
  useInstructorExamResults,
} from "@/features/instructor/instructor.hooks";
import type { InstructorExamResult } from "@/features/instructor/instructor.types";
import { useState } from "react";

function getStudentName(
  result: InstructorExamResult,
) {
  if (!result.student) {
    return "Unknown Student";
  }

  return `${result.student.firstName} ${result.student.lastName}`;
}

function getMarks(result: InstructorExamResult) {
  return Number(result.marksObtained ?? 0);
}

function getTotalMarks(
  result: InstructorExamResult,
) {
  return Number(result.exam?.totalMarks ?? 0);
}

function getPercentage(
  result: InstructorExamResult,
) {
  const marks = getMarks(result);
  const total = getTotalMarks(result);

  if (!total) return 0;

  return Math.round((marks / total) * 100);
}

function isPassing(
  result: InstructorExamResult,
) {
  const percentage = getPercentage(result);

  return percentage >= 40;
}

function ResultsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-40" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <Card key={index}>
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-20" />
              </CardContent>
            </Card>
          ),
        )}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>

        <CardContent className="space-y-4">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="flex items-center gap-4"
              >
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ),
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function InstructorExamResultsPage() {
  const params = useParams<{
    id: string;
  }>();

  const examId = params.id;

  const [search, setSearch] = useState("");

  const {
    data: exam,
    isLoading: isExamLoading,
  } = useInstructorExam(examId);

  const {
    data: results = [],
    isLoading: isResultsLoading,
    isError,
    isFetching,
    refetch,
  } = useInstructorExamResults(examId);

  const isLoading =
    isExamLoading || isResultsLoading;

  const filteredResults = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return results;
    }

    return results.filter((result) => {
      const studentName =
        getStudentName(result).toLowerCase();

      const studentId =
        result.student?.studentId
          ?.toLowerCase() ?? "";

      const email =
        result.student?.email
          ?.toLowerCase() ?? "";

      return (
        studentName.includes(query) ||
        studentId.includes(query) ||
        email.includes(query)
      );
    });
  }, [results, search]);

  const statistics = useMemo(() => {
    if (!results.length) {
      return {
        total: 0,
        average: 0,
        highest: 0,
        passed: 0,
        failed: 0,
      };
    }

    const marks = results.map(getMarks);

    const totalMarks =
      results.reduce(
        (sum, result) =>
          sum + getMarks(result),
        0,
      );

    const average =
      totalMarks / results.length;

    const highest = Math.max(...marks);

    const passed = results.filter(isPassing).length;

    return {
      total: results.length,
      average: Number(average.toFixed(2)),
      highest,
      passed,
      failed: results.length - passed,
    };
  }, [results]);

  if (isLoading) {
    return <ResultsSkeleton />;
  }

  if (!exam) {
    return (
      <div className="space-y-6">
        <Link
          href="/instructor/exams"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Exams
        </Link>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="size-8 text-muted-foreground" />

            <h1 className="mt-4 text-xl font-semibold">
              Exam not found
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              We couldn't load the selected exam.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Link
          href={`/instructor/exams/${examId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Exam
        </Link>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <XCircle className="size-8 text-destructive" />

            <h1 className="mt-4 text-xl font-semibold">
              Unable to load results
            </h1>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              We couldn't retrieve the results for
              this exam.
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

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/instructor"
          className="hover:text-foreground"
        >
          Dashboard
        </Link>

        <span>/</span>

        <Link
          href="/instructor/exams"
          className="hover:text-foreground"
        >
          Exams
        </Link>

        <span>/</span>

        <Link
          href={`/instructor/exams/${examId}`}
          className="max-w-40 truncate hover:text-foreground"
        >
          {exam.title}
        </Link>

        <span>/</span>

        <span className="text-foreground">
          Results
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {exam.examType}
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
            Exam Results
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {exam.title}

            {exam.section.sectionCode
              ? ` • Section ${exam.section.sectionCode}`
              : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/instructor/exams/${examId}`}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to Exam
          </Link>

          <Button
            type="button"
            variant="outline"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            <RefreshCw
              className={`size-4 ${
                isFetching
                  ? "animate-spin"
                  : ""
              }`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Results
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {statistics.total}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-2.5">
                <Users className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Average Marks
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {statistics.average}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-2.5">
                <BarChart3 className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Highest Marks
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {statistics.highest}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-2.5">
                <Award className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Pass Rate
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {statistics.total
                    ? Math.round(
                        (statistics.passed /
                          statistics.total) *
                          100,
                      )
                    : 0}
                  %
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-2.5">
                <TrendingUp className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exam Summary */}
      <Card>
        <CardContent className="p-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <BookOpen className="size-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Course
                </p>

                <p className="text-sm font-medium">
                  {exam.courseOffering?.course
                    ?.code ?? "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="size-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Total Marks
                </p>

                <p className="text-sm font-medium">
                  {exam.totalMarks}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Passed
                </p>

                <p className="text-sm font-medium">
                  {statistics.passed}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <XCircle className="size-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Failed
                </p>

                <p className="text-sm font-medium">
                  {statistics.failed}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>
                Student Results
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {filteredResults.length} of{" "}
                {results.length} results
              </p>
            </div>

            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search student..."
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {!results.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-4">
                <FileText className="size-7 text-muted-foreground" />
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                No results yet
              </h2>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                No student results have been recorded
                for this exam yet.
              </p>
            </div>
          ) : !filteredResults.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="size-7 text-muted-foreground" />

              <h2 className="mt-3 font-semibold">
                No students found
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Try a different student name, ID, or
                email.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Student
                      </th>

                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Student ID
                      </th>

                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Marks
                      </th>

                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Percentage
                      </th>

                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Grade
                      </th>

                      <th className="px-4 py-3 font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredResults.map(
                      (result) => {
                        const percentage =
                          getPercentage(
                            result,
                          );

                        const passed =
                          isPassing(result);

                        return (
                          <tr
                            key={result.id}
                            className="border-b last:border-0"
                          >
                            <td className="px-4 py-4">
                              <div>
                                <p className="font-medium">
                                  {getStudentName(
                                    result,
                                  )}
                                </p>

                                {result.student
                                  ?.email && (
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {
                                      result
                                        .student
                                        .email
                                    }
                                  </p>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <span className="font-medium">
                                {result.student
                                  ?.studentId ??
                                  "—"}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              <span className="font-semibold">
                                {getMarks(result)}
                              </span>

                              <span className="text-muted-foreground">
                                {" "}
                                /{" "}
                                {getTotalMarks(
                                  result,
                                )}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              {percentage}%
                            </td>

                            <td className="px-4 py-4">
                              <Badge variant="secondary">
                                {result.grade ??
                                  "Not graded"}
                              </Badge>
                            </td>

                            <td className="px-4 py-4">
                              <Badge
                                variant={
                                  passed
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {passed
                                  ? "Passed"
                                  : "Failed"}
                              </Badge>
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-3 md:hidden">
                {filteredResults.map(
                  (result) => {
                    const percentage =
                      getPercentage(result);

                    const passed =
                      isPassing(result);

                    return (
                      <div
                        key={result.id}
                        className="rounded-lg border p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold">
                              {getStudentName(
                                result,
                              )}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {result.student
                                ?.studentId ??
                                "No student ID"}
                            </p>
                          </div>

                          <Badge
                            variant={
                              passed
                                ? "default"
                                : "destructive"
                            }
                          >
                            {passed
                              ? "Passed"
                              : "Failed"}
                          </Badge>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Marks
                            </p>

                            <p className="mt-1 font-semibold">
                              {getMarks(result)}{" "}
                              <span className="font-normal text-muted-foreground">
                                /{" "}
                                {getTotalMarks(
                                  result,
                                )}
                              </span>
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Percentage
                            </p>

                            <p className="mt-1 font-semibold">
                              {percentage}%
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Grade
                            </p>

                            <div className="mt-1">
                              <Badge variant="secondary">
                                {result.grade ??
                                  "Not graded"}
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Grade Point
                            </p>

                            <p className="mt-1 font-semibold">
                              {result.gradePoint ??
                                "—"}
                            </p>
                          </div>
                        </div>

                        {result.remarks && (
                          <div className="mt-4 border-t pt-3">
                            <p className="text-xs text-muted-foreground">
                              Remarks
                            </p>

                            <p className="mt-1 text-sm">
                              {result.remarks}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}