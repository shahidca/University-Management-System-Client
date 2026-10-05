"use client";

import Link from "next/link";
import {
      ArrowLeft,
      ArrowRight,
      CalendarDays,
      CheckCircle2,
      Clock3,
      FileText,
      GraduationCap,
      MapPin,
      RefreshCw,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
      Card,
      CardContent,
      CardHeader,
      CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useMyExams } from "@/features/exam/exam.hooks";
import type {
      Exam,
      ExamType,
} from "@/features/exam/exam.types";

function formatDate(date: string) {
      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
            return date;
      }

      return new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
      }).format(parsedDate);
}

function formatTime(time: string) {
      if (!time) {
            return "—";
      }

      const date = new Date(`1970-01-01T${time}`);

      if (Number.isNaN(date.getTime())) {
            return time;
      }

      return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
      }).format(date);
}

function formatExamType(type: ExamType) {
      const labels: Record<ExamType, string> = {
            MIDTERM: "Midterm",
            FINAL: "Final",
            QUIZ: "Quiz",
            ASSIGNMENT: "Assignment",
            PRACTICAL: "Practical",
            VIVA: "Viva",
      };

      return labels[type] ?? type;
}

function getExamTypeVariant(type: ExamType) {
      switch (type) {
            case "FINAL":
                  return "default" as const;

            case "MIDTERM":
                  return "secondary" as const;

            default:
                  return "outline" as const;
      }
}

function isUpcoming(examDate: string, endTime: string) {
      const now = new Date();

      const datePart = examDate.includes("T")
            ? examDate.split("T")[0]
            : examDate;

      const endDateTime = new Date(
            `${datePart}T${endTime || "23:59:59"}`,
      );

      return endDateTime >= now;
}

function ExamCard({ exam }: { exam: Exam }) {
      const upcoming = isUpcoming(exam.date, exam.endTime);

      return (
            <Card className="overflow-hidden transition-shadow hover:shadow-md">
                  <CardHeader className="border-b bg-muted/20">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                          <Badge variant={getExamTypeVariant(exam.type)}>
                                                {formatExamType(exam.type)}
                                          </Badge>

                                          {exam.isPublished ? (
                                                <Badge
                                                      variant="outline"
                                                      className="gap-1"
                                                >
                                                      <CheckCircle2 className="size-3.5" />
                                                      Published
                                                </Badge>
                                          ) : (
                                                <Badge variant="secondary">
                                                      Not Published
                                                </Badge>
                                          )}
                                    </div>

                                    <CardTitle className="mt-3 text-lg">
                                          {exam.title}
                                    </CardTitle>

                                    <p className="text-muted-foreground mt-1 text-sm">
                                          {exam.section.courseOffering.course.code}{" "}
                                          ·{" "}
                                          {exam.section.courseOffering.course.title}
                                    </p>
                              </div>

                              <Badge
                                    variant={upcoming ? "default" : "secondary"}
                                    className="w-fit"
                              >
                                    {upcoming ? "Upcoming" : "Completed"}
                              </Badge>
                        </div>
                  </CardHeader>

                  <CardContent className="space-y-5 pt-6">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                              <div className="rounded-xl border p-4">
                                    <div className="flex items-center gap-2">
                                          <CalendarDays className="text-primary size-4" />

                                          <p className="text-muted-foreground text-xs font-medium">
                                                Date
                                          </p>
                                    </div>

                                    <p className="mt-2 text-sm font-semibold">
                                          {formatDate(exam.date)}
                                    </p>
                              </div>

                              <div className="rounded-xl border p-4">
                                    <div className="flex items-center gap-2">
                                          <Clock3 className="text-primary size-4" />

                                          <p className="text-muted-foreground text-xs font-medium">
                                                Time
                                          </p>
                                    </div>

                                    <p className="mt-2 text-sm font-semibold">
                                          {formatTime(exam.startTime)}
                                          {" – "}
                                          {formatTime(exam.endTime)}
                                    </p>
                              </div>

                              <div className="rounded-xl border p-4">
                                    <div className="flex items-center gap-2">
                                          <FileText className="text-primary size-4" />

                                          <p className="text-muted-foreground text-xs font-medium">
                                                Total Marks
                                          </p>
                                    </div>

                                    <p className="mt-2 text-sm font-semibold">
                                          {exam.totalMarks}
                                    </p>
                              </div>

                              <div className="rounded-xl border p-4">
                                    <div className="flex items-center gap-2">
                                          <GraduationCap className="text-primary size-4" />

                                          <p className="text-muted-foreground text-xs font-medium">
                                                Passing Marks
                                          </p>
                                    </div>

                                    <p className="mt-2 text-sm font-semibold">
                                          {exam.passingMarks}
                                    </p>
                              </div>
                        </div>

                        <div className="grid gap-4 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2">
                              <div>
                                    <p className="text-muted-foreground text-xs font-medium">
                                          Section
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                          {exam.section.sectionCode}
                                          {" · "}
                                          {exam.section.name}
                                    </p>
                              </div>

                              <div>
                                    <p className="text-muted-foreground text-xs font-medium">
                                          Semester
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                          {exam.section.courseOffering.semester.name}
                                          {" · "}
                                          {exam.section.courseOffering.semester.code}
                                    </p>
                              </div>
                        </div>

                        {exam.instructions && (
                              <div className="rounded-xl border border-dashed p-4">
                                    <p className="text-sm font-semibold">
                                          Instructions
                                    </p>

                                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                                          {exam.instructions}
                                    </p>
                              </div>
                        )}

                        <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                          <MapPin className="size-3.5" />
                                          Section {exam.section.sectionCode}
                                    </span>

                                    <span>
                                          Course offering:{" "}
                                          {exam.section.courseOffering.code}
                                    </span>

                                    <span>
                                          Credits:{" "}
                                          {exam.section.courseOffering.credits}
                                    </span>
                              </div>

                              <Link
                                    href={`/student/exams/${exam.id}`}
                                    className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                    View Details
                                    <ArrowRight className="size-4" />
                              </Link>
                        </div>
                  </CardContent>
            </Card>
      );
}

function ExamCardSkeleton() {
      return (
            <Card>
                  <CardHeader className="space-y-3">
                        <div className="flex items-center justify-between gap-4">
                              <div className="space-y-2">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-6 w-64" />
                                    <Skeleton className="h-4 w-48" />
                              </div>

                              <Skeleton className="h-6 w-20" />
                        </div>
                  </CardHeader>

                  <CardContent className="space-y-5">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                              {Array.from({ length: 4 }).map((_, index) => (
                                    <Skeleton
                                          key={index}
                                          className="h-20 w-full"
                                    />
                              ))}
                        </div>

                        <Skeleton className="h-20 w-full" />
                  </CardContent>
            </Card>
      );
}

export default function StudentExamsPage() {
      const {
            data,
            isLoading,
            isError,
            refetch,
            isFetching,
      } = useMyExams({
            page: 1,
            limit: 50,
            sortBy: "date",
            sortOrder: "asc",
      });

      const exams = data?.items ?? [];

      const upcomingExams = exams.filter((exam) =>
            isUpcoming(exam.date, exam.endTime),
      );

      const publishedExams = exams.filter(
            (exam) => exam.isPublished,
      );

      return (
            <div className="space-y-8">
                  {/* Header */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                              <div className="flex items-center gap-2">
                                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                                          <FileText className="size-5" />
                                    </div>

                                    <div>
                                          <h1 className="text-2xl font-bold tracking-tight">
                                                Exams
                                          </h1>

                                          <p className="text-muted-foreground text-sm">
                                                View your upcoming and published examinations.
                                          </p>
                                    </div>
                              </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                              <Button
                                    variant="outline"
                                    onClick={() => refetch()}
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

                              <Link
                                    href="/student"
                                    className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium shadow-xs transition-colors"
                              >
                                    <ArrowLeft className="size-4" />
                                    Dashboard
                              </Link>
                        </div>
                  </div>

                  {/* Error */}
                  {isError && (
                        <Alert variant="destructive">
                              <FileText className="size-4" />

                              <AlertTitle>
                                    Unable to load exams
                              </AlertTitle>

                              <AlertDescription className="flex flex-col gap-3">
                                    <p>
                                          We could not retrieve your examination
                                          schedule. Please try again.
                                    </p>

                                    <Button
                                          variant="outline"
                                          size="sm"
                                          className="w-fit"
                                          onClick={() => refetch()}
                                    >
                                          Try again
                                    </Button>
                              </AlertDescription>
                        </Alert>
                  )}

                  {/* Summary */}
                  {!isError && (
                        <section className="grid gap-4 sm:grid-cols-3">
                              <Card>
                                    <CardContent className="pt-6">
                                          <div className="flex items-center justify-between">
                                                <p className="text-muted-foreground text-sm">
                                                      Total Exams
                                                </p>

                                                <FileText className="text-muted-foreground size-4" />
                                          </div>

                                          {isLoading ? (
                                                <Skeleton className="mt-2 h-8 w-16" />
                                          ) : (
                                                <p className="mt-2 text-3xl font-bold">
                                                      {exams.length}
                                                </p>
                                          )}

                                          <p className="text-muted-foreground mt-1 text-xs">
                                                Exams in your schedule
                                          </p>
                                    </CardContent>
                              </Card>

                              <Card>
                                    <CardContent className="pt-6">
                                          <div className="flex items-center justify-between">
                                                <p className="text-muted-foreground text-sm">
                                                      Upcoming
                                                </p>

                                                <CalendarDays className="text-muted-foreground size-4" />
                                          </div>

                                          {isLoading ? (
                                                <Skeleton className="mt-2 h-8 w-16" />
                                          ) : (
                                                <p className="mt-2 text-3xl font-bold">
                                                      {upcomingExams.length}
                                                </p>
                                          )}

                                          <p className="text-muted-foreground mt-1 text-xs">
                                                Examinations still ahead
                                          </p>
                                    </CardContent>
                              </Card>

                              <Card>
                                    <CardContent className="pt-6">
                                          <div className="flex items-center justify-between">
                                                <p className="text-muted-foreground text-sm">
                                                      Published
                                                </p>

                                                <CheckCircle2 className="text-muted-foreground size-4" />
                                          </div>

                                          {isLoading ? (
                                                <Skeleton className="mt-2 h-8 w-16" />
                                          ) : (
                                                <p className="mt-2 text-3xl font-bold">
                                                      {publishedExams.length}
                                                </p>
                                          )}

                                          <p className="text-muted-foreground mt-1 text-xs">
                                                Exams currently published
                                          </p>
                                    </CardContent>
                              </Card>
                        </section>
                  )}

                  {/* Exam list */}
                  <section className="space-y-4">
                        <div>
                              <h2 className="text-xl font-semibold tracking-tight">
                                    Examination Schedule
                              </h2>

                              <p className="text-muted-foreground mt-1 text-sm">
                                    Your examination dates, times, marks, and course
                                    information.
                              </p>
                        </div>

                        {isLoading ? (
                              <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                          <ExamCardSkeleton key={index} />
                                    ))}
                              </div>
                        ) : exams.length === 0 ? (
                              <Card>
                                    <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
                                          <div className="bg-muted flex size-14 items-center justify-center rounded-full">
                                                <CalendarDays className="text-muted-foreground size-6" />
                                          </div>

                                          <h3 className="mt-4 text-lg font-semibold">
                                                No exams found
                                          </h3>

                                          <p className="text-muted-foreground mt-1 max-w-md text-sm">
                                                There are currently no examinations available
                                                for your enrolled courses.
                                          </p>
                                    </CardContent>
                              </Card>
                        ) : (
                              <div className="space-y-4">
                                    {exams.map((exam) => (
                                          <ExamCard
                                                key={exam.id}
                                                exam={exam}
                                          />
                                    ))}
                              </div>
                        )}
                  </section>
            </div>
      );
}