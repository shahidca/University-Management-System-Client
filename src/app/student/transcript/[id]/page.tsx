"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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

import { useTranscript } from "@/features/transcript/transcript.hooks";

function formatDate(value: string | null) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
}

function formatNumber(value: number | string | null) {
  if (value === null || value === undefined) {
    return "0";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return String(value);
  }

  return number.toFixed(2).replace(/\.00$/, "");
}

function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "ISSUED":
      return "default";

    case "APPROVED":
      return "secondary";

    case "REVOKED":
      return "destructive";

    default:
      return "outline";
  }
}

function TranscriptDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>

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
          <Skeleton className="h-6 w-40" />
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-48 max-w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function TranscriptDetailsPage() {
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
      <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <TranscriptDetailsSkeleton />
      </div>
    );
  }

  if (isError || !transcript) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/student/transcript"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Transcripts
          </Link>
        </div>

        <Alert variant="destructive">
          <AlertTitle>
            Unable to load transcript
          </AlertTitle>

          <AlertDescription className="mt-2 flex flex-col gap-4">
            <span>
              {error instanceof Error
                ? error.message
                : "We could not load this transcript. Please try again."}
            </span>

            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`size-4 ${
                  isFetching ? "animate-spin" : ""
                }`}
              />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const studentName =
    `${transcript.student.firstName} ${transcript.student.lastName}`.trim();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/student/transcript"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Transcripts
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Transcript Details
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {transcript.semester.name}{" "}
                <span className="text-border">•</span>{" "}
                {transcript.semester.code}
              </p>
            </div>
          </div>
        </div>

        <Badge
          variant={getStatusVariant(transcript.status)}
          className="w-fit"
        >
          {transcript.status}
        </Badge>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Semester GPA
              </p>

              <GraduationCap className="size-5 text-primary" />
            </div>

            <p className="text-3xl font-bold">
              {formatNumber(transcript.semesterGpa)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Cumulative GPA
              </p>

              <ShieldCheck className="size-5 text-primary" />
            </div>

            <p className="text-3xl font-bold">
              {formatNumber(transcript.cumulativeGpa)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total Credits
              </p>

              <CheckCircle2 className="size-5 text-primary" />
            </div>

            <p className="text-3xl font-bold">
              {formatNumber(transcript.totalCredits)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Issued
              </p>

              <CalendarDays className="size-5 text-primary" />
            </div>

            <p className="text-lg font-semibold">
              {formatDate(transcript.issuedAt)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Student Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Student Name
            </p>
            <p className="mt-1 font-medium">{studentName}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Student ID
            </p>
            <p className="mt-1 font-medium">
              {transcript.student.studentId}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Program
            </p>
            <p className="mt-1 font-medium">
              {transcript.student.program?.name ??
                "Not available"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Program Code
            </p>
            <p className="mt-1 font-medium">
              {transcript.student.program?.code ??
                "Not available"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Degree
            </p>
            <p className="mt-1 font-medium">
              {transcript.student.program?.degree ??
                "Not available"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Semester Type
            </p>
            <p className="mt-1 font-medium">
              {transcript.semester.type}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transcript Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transcript Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Transcript Number
            </p>
            <p className="mt-1 break-all font-medium">
              {transcript.transcriptNo}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Status
            </p>
            <div className="mt-2">
              <Badge
                variant={getStatusVariant(
                  transcript.status,
                )}
              >
                {transcript.status}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Semester
            </p>
            <p className="mt-1 font-medium">
              {transcript.semester.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Semester Code
            </p>
            <p className="mt-1 font-medium">
              {transcript.semester.code}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Start Date
            </p>
            <p className="mt-1 font-medium">
              {formatDate(transcript.semester.startDate)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              End Date
            </p>
            <p className="mt-1 font-medium">
              {formatDate(transcript.semester.endDate)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Issued At
            </p>
            <p className="mt-1 font-medium">
              {formatDate(transcript.issuedAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Approved At
            </p>
            <p className="mt-1 font-medium">
              {formatDate(transcript.approvedAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Created At
            </p>
            <p className="mt-1 font-medium">
              {formatDate(transcript.createdAt)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Verification */}
      <Alert>
        <ShieldCheck className="size-4" />

        <AlertTitle>
          Official transcript record
        </AlertTitle>

        <AlertDescription>
          This transcript is retrieved directly from
          UniCore&apos;s academic record system. The
          transcript status and academic information shown
          here are provided by the university management
          system.
        </AlertDescription>
      </Alert>
    </div>
  );
}