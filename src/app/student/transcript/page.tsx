"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  GraduationCap,
  RefreshCw,
  ShieldCheck,
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

import { useMyIssuedTranscripts } from "@/features/transcript/transcript.hooks";

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatNumber(value: number | string) {
  return Number(value).toFixed(2);
}

function TranscriptSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-3 p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>

        <CardContent className="space-y-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>

                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StudentTranscriptPage() {
  const {
    data: transcripts,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyIssuedTranscripts();

  const issuedTranscripts = transcripts ?? [];

  const totalTranscripts = issuedTranscripts.length;

  const totalCredits = issuedTranscripts.reduce(
    (sum, transcript) =>
      sum + Number(transcript.totalCredits),
    0,
  );

  const latestTranscript = issuedTranscripts[0];

  const latestCgpa = latestTranscript
    ? Number(latestTranscript.cumulativeGpa)
    : 0;

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-6 text-primary" />

            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Academic Transcript
            </h1>
          </div>

          <p className="text-sm text-muted-foreground">
            View your officially issued academic transcripts.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`size-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />

            Refresh
          </Button>

          <Link
            href="/student"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
        </div>
      </div>

      {/* Loading */}
      {isLoading && <TranscriptSkeleton />}

      {/* Error */}
      {!isLoading && isError && (
        <Alert variant="destructive">
          <FileText className="size-4" />

          <AlertTitle>
            Unable to load transcripts
          </AlertTitle>

          <AlertDescription className="flex flex-col gap-3">
            <span>
              {error instanceof Error
                ? error.message
                : "Something went wrong while loading your transcripts."}
            </span>

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

      {/* Main content */}
      {!isLoading && !isError && (
        <>
          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Issued Transcripts
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {totalTranscripts}
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <FileText className="size-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Latest CGPA
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {latestTranscript
                        ? formatNumber(latestCgpa)
                        : "—"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                    <GraduationCap className="size-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Latest Semester GPA
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {latestTranscript
                        ? formatNumber(
                            latestTranscript.semesterGpa,
                          )
                        : "—"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                    <ShieldCheck className="size-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Credits
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {totalCredits}
                    </p>
                  </div>

                  <div className="rounded-xl bg-violet-500/10 p-3 text-violet-600 dark:text-violet-400">
                    <CheckCircle2 className="size-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Empty state */}
          {issuedTranscripts.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                  <FileText className="size-8 text-muted-foreground" />
                </div>

                <h2 className="mt-5 text-lg font-semibold">
                  No issued transcripts yet
                </h2>

                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Your transcript will appear here after it has
                  been officially issued by the university.
                </p>

                <Link
                  href="/student/results"
                  className="mt-6 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
                >
                  View Results
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Transcript list */}
          {issuedTranscripts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Issued Transcripts</CardTitle>

                <p className="text-sm text-muted-foreground">
                  Official transcripts issued for your completed
                  academic semesters.
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {issuedTranscripts.map((transcript) => (
                  <div
                    key={transcript.id}
                    className="rounded-xl border bg-card p-5 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {transcript.semester.name}
                          </h3>

                          <Badge variant="secondary">
                            {transcript.semester.code}
                          </Badge>

                          <Badge className="gap-1">
                            <CheckCircle2 className="size-3" />
                            Issued
                          </Badge>
                        </div>

                        <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Transcript No.
                            </p>

                            <p className="mt-1 font-medium">
                              {transcript.transcriptNo}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Semester GPA
                            </p>

                            <p className="mt-1 font-medium">
                              {formatNumber(
                                transcript.semesterGpa,
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Cumulative GPA
                            </p>

                            <p className="mt-1 font-medium">
                              {formatNumber(
                                transcript.cumulativeGpa,
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Total Credits
                            </p>

                            <p className="mt-1 font-medium">
                              {transcript.totalCredits}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="size-4" />
                            Issued{" "}
                            {formatDate(transcript.issuedAt)}
                          </span>

                          <span>
                            {transcript.semester.type}
                          </span>

                          <span>
                            {transcript.student.program?.name ??
                              "Program unavailable"}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <Link
                          href={`/student/transcript/${transcript.id}`}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <FileText className="size-4" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}