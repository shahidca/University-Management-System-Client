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
  GraduationCap,
  Hash,
  RefreshCw,
  UserRound,
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useTranscript } from "@/features/transcript/transcript.hooks";
import type { TranscriptStatus } from "@/features/transcript/transcript.types";

function formatDate(value: string | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatGpa(value: number | string) {
  return Number(value).toFixed(2);
}

function getStatusVariant(status: TranscriptStatus) {
  switch (status) {
    case "ISSUED":
      return "default";

    case "APPROVED":
      return "secondary";

    case "GENERATED":
      return "outline";

    case "REVOKED":
      return "destructive";

    default:
      return "outline";
  }
}

function getStatusLabel(status: TranscriptStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-8 w-64" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>

          <CardContent className="space-y-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-48" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>

          <CardContent className="space-y-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-48" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function TranscriptDetailPage() {
  const params = useParams<{ id: string }>();
  const transcriptId = params.id;

  const {
    data: transcript,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useTranscript(transcriptId);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <DetailSkeleton />
      </main>
    );
  }

  if (isError || !transcript) {
    return (
      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <Link
            href="/student/transcript"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transcript
          </Link>

          <Alert variant="destructive">
            <AlertTitle>Unable to load transcript</AlertTitle>

            <AlertDescription className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <span>
                {error instanceof Error
                  ? error.message
                  : "The requested transcript could not be loaded."}
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
                disabled={isFetching}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isFetching ? "animate-spin" : ""
                  }`}
                />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  const studentName =
    `${transcript.student.firstName} ${transcript.student.lastName}`.trim();

  return (
    <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Link
              href="/student/transcript"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Transcript
            </Link>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Academic Transcript
                </h1>

                <Badge variant={getStatusVariant(transcript.status)}>
                  {getStatusLabel(transcript.status)}
                </Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Official academic record for {studentName}.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
        </div>

        {/* Transcript overview */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Transcript Overview
                </CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  {transcript.semester.name} ({transcript.semester.code})
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span className="font-mono">
                  {transcript.transcriptNo}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Semester GPA
              </p>

              <p className="mt-1 text-2xl font-bold">
                {formatGpa(transcript.semesterGpa)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Cumulative GPA
              </p>

              <p className="mt-1 text-2xl font-bold">
                {formatGpa(transcript.cumulativeGpa)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total Credits
              </p>

              <p className="mt-1 text-2xl font-bold">
                {Number(transcript.totalCredits)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Transcript Status
              </p>

              <div className="mt-2">
                <Badge variant={getStatusVariant(transcript.status)}>
                  {getStatusLabel(transcript.status)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student + semester */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                Student Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  Full Name
                </p>

                <p className="mt-1 font-medium">
                  {studentName}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">
                  Student ID
                </p>

                <p className="mt-1 font-mono font-medium">
                  {transcript.student.studentId}
                </p>
              </div>

              {transcript.student.program && (
                <>
                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Program
                    </p>

                    <p className="mt-1 font-medium">
                      {transcript.student.program.name}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {transcript.student.program.code} ·{" "}
                      {transcript.student.program.degree}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Semester Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  Semester
                </p>

                <p className="mt-1 font-medium">
                  {transcript.semester.name}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {transcript.semester.code}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">
                  Semester Type
                </p>

                <p className="mt-1 font-medium">
                  {transcript.semester.type}
                </p>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Start Date
                  </p>

                  <p className="mt-1 flex items-center gap-2 font-medium">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    {formatDate(transcript.semester.startDate)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    End Date
                  </p>

                  <p className="mt-1 flex items-center gap-2 font-medium">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    {formatDate(transcript.semester.endDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock3 className="h-5 w-5" />
              Transcript Timeline
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                </div>

                <div>
                  <p className="font-medium">
                    Generated
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {formatDate(transcript.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5">
                  <CheckCircle2
                    className={`h-5 w-5 ${
                      transcript.approvedAt
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>

                <div>
                  <p className="font-medium">
                    Approved
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {formatDate(transcript.approvedAt)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5">
                  <CheckCircle2
                    className={`h-5 w-5 ${
                      transcript.issuedAt
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>

                <div>
                  <p className="font-medium">
                    Issued
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {formatDate(transcript.issuedAt)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Academic Summary
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">
                  Semester GPA
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {formatGpa(transcript.semesterGpa)}
                </p>
              </div>

              <div className="rounded-lg border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">
                  Cumulative GPA
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {formatGpa(transcript.cumulativeGpa)}
                </p>
              </div>

              <div className="rounded-lg border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">
                  Credits Earned
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {Number(transcript.totalCredits)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}