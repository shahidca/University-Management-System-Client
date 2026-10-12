"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Loader2,
  Save,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  useCreateInstructorExamResult,
  useInstructorExam,
  useInstructorSectionEnrollments,
} from "@/features/instructor/instructor.hooks";

import type {
  InstructorEnrollment,
} from "@/features/instructor/instructor.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

function getExamTypeLabel(
  examType: string,
) {
  return examType
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatDate(date: string) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function StudentOption({
  enrollment,
  selected,
  onSelect,
}: {
  enrollment: InstructorEnrollment;
  selected: boolean;
  onSelect: () => void;
}) {
  const student = enrollment.student;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border p-4 text-left transition-colors ${
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-semibold">
            {student.firstName}{" "}
            {student.lastName}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {student.studentId}
          </p>

          <p className="mt-1 truncate text-sm text-muted-foreground">
            {student.email}
          </p>
        </div>

        {selected ? (
          <CheckCircle2 className="size-5 shrink-0 text-primary" />
        ) : null}
      </div>
    </button>
  );
}

export default function CreateInstructorExamResultPage() {
  const params = useParams<{
    id: string;
  }>();

  const router = useRouter();

  const examId = params.id;

  const {
    data: exam,
    isLoading: isExamLoading,
    isError: isExamError,
    refetch: refetchExam,
  } = useInstructorExam(examId);

  const sectionId = exam?.section?.id ?? "";

  const {
    data: enrollments = [],
    isLoading: isEnrollmentsLoading,
    isError: isEnrollmentsError,
    refetch: refetchEnrollments,
  } = useInstructorSectionEnrollments(
    sectionId,
  );

  const createResultMutation =
    useCreateInstructorExamResult(examId);

  const [selectedEnrollmentId, setSelectedEnrollmentId] =
    useState("");

  const [marksObtained, setMarksObtained] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  const [formError, setFormError] =
    useState<string | null>(null);

  const selectedEnrollment =
    useMemo<InstructorEnrollment | null>(
      () =>
        enrollments.find(
          (enrollment) =>
            enrollment.id ===
            selectedEnrollmentId,
        ) ?? null,
      [
        enrollments,
        selectedEnrollmentId,
      ],
    );

  const totalMarks = Number(
    exam?.totalMarks ?? 0,
  );

  const isLoading =
    isExamLoading ||
    (Boolean(sectionId) &&
      isEnrollmentsLoading);

  const isError =
    isExamError ||
    isEnrollmentsError;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setFormError(null);

    if (!selectedEnrollmentId) {
      setFormError(
        "Please select a student.",
      );
      return;
    }

    const marks = Number(marksObtained);

    if (
      !Number.isFinite(marks) ||
      marks < 0
    ) {
      setFormError(
        "Please enter a valid marks value.",
      );
      return;
    }

    if (marks > totalMarks) {
      setFormError(
        `Marks cannot exceed ${totalMarks}.`,
      );
      return;
    }

    try {
      await createResultMutation.mutateAsync({
        examId,
        enrollmentId:
          selectedEnrollmentId,
        marksObtained: marks,
        ...(remarks.trim()
          ? {
              remarks: remarks.trim(),
            }
          : {}),
      });

      router.push(
        `/instructor/exams/${examId}/results`,
      );
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to create the result.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>

            <CardContent className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>

            <CardContent className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !exam) {
    return (
      <div className="space-y-6">
        <Link
          href={`/instructor/exams/${examId}/results`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Results
        </Link>

        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="mb-4 size-10 text-destructive" />

            <h2 className="text-lg font-semibold">
              Unable to load exam
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              We could not load the exam or its
              enrolled students.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                onClick={() => {
                  void refetchExam();
                  void refetchEnrollments();
                }}
              >
                Try Again
              </Button>

              <Link
                href={`/instructor/exams/${examId}`}
                className="inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                Exam Details
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Link
            href={`/instructor/exams/${examId}/results`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Results
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Enter Result
              </h1>

              <Badge variant="secondary">
                {getExamTypeLabel(
                  exam.examType,
                )}
              </Badge>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Record the result for an enrolled
              student.
            </p>
          </div>
        </div>
      </div>

      {/* Exam summary */}
      <Card>
        <CardContent className="p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <BookOpen className="size-4 text-primary" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Exam
                </p>

                <p className="truncate font-semibold">
                  {exam.title}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="size-4 text-primary" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Section
                </p>

                <p className="font-semibold">
                  {exam.section.sectionCode}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Exam Date
              </p>

              <p className="mt-1 font-semibold">
                {formatDate(exam.examDate)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Total Marks
              </p>

              <p className="mt-1 font-semibold">
                {totalMarks}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1fr_360px]"
      >
        {/* Student selection */}
        <Card>
          <CardHeader>
            <CardTitle>
              Select Student
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {enrollments.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <Users className="mx-auto mb-3 size-8 text-muted-foreground" />

                <h3 className="font-semibold">
                  No enrolled students
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  There are currently no enrolled
                  students in this section.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {enrollments.map(
                  (enrollment) => (
                    <StudentOption
                      key={enrollment.id}
                      enrollment={enrollment}
                      selected={
                        enrollment.id ===
                        selectedEnrollmentId
                      }
                      onSelect={() =>
                        setSelectedEnrollmentId(
                          enrollment.id,
                        )
                      }
                    />
                  ),
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result form */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>
              Result Details
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {selectedEnrollment ? (
              <div className="rounded-xl border bg-muted/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Selected Student
                </p>

                <p className="mt-1 font-semibold">
                  {
                    selectedEnrollment.student
                      .firstName
                  }{" "}
                  {
                    selectedEnrollment.student
                      .lastName
                  }
                </p>

                <p className="text-sm text-muted-foreground">
                  {
                    selectedEnrollment.student
                      .studentId
                  }
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                Select a student to enter their
                result.
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="marksObtained">
                Marks Obtained
              </Label>

              <div className="relative">
                <input
                  id="marksObtained"
                  type="number"
                  min={0}
                  max={totalMarks}
                  step="0.01"
                  value={marksObtained}
                  onChange={(event) =>
                    setMarksObtained(
                      event.target.value,
                    )
                  }
                  placeholder="0"
                  disabled={
                    !selectedEnrollment
                  }
                  className="h-10 w-full rounded-md border border-input bg-background px-3 pr-20 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  / {totalMarks}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">
                Remarks
                <span className="ml-1 font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>

              <Textarea
                id="remarks"
                value={remarks}
                onChange={(event) =>
                  setRemarks(event.target.value)
                }
                placeholder="Add any remarks about this result..."
                rows={4}
                disabled={
                  !selectedEnrollment
                }
              />
            </div>

            {formError ? (
              <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />

                <span>{formError}</span>
              </div>
            ) : null}

            {createResultMutation.isError &&
            !formError ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                Failed to save the result. Please
                try again.
              </div>
            ) : null}

            <Button
              type="submit"
              className="w-full"
              disabled={
                !selectedEnrollment ||
                createResultMutation.isPending
              }
            >
              {createResultMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving Result...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save Result
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Grade and grade point will be
              calculated automatically.
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}