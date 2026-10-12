"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardEdit,
  Loader2,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  useInstructorExam,
  useUpdateInstructorExam,
} from "@/features/instructor/instructor.hooks";
import type {
  InstructorExam,
  UpdateInstructorExamInput,
} from "@/features/instructor/instructor.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const examTypes = [
  { value: "QUIZ", label: "Quiz" },
  { value: "ASSIGNMENT", label: "Assignment" },
  { value: "MIDTERM", label: "Midterm" },
  { value: "FINAL", label: "Final" },
  { value: "VIVA", label: "Viva" },
  { value: "PROJECT", label: "Project" },
  { value: "PRESENTATION", label: "Presentation" },
] as const;

function formatDateForInput(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    "0",
  );
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeTime(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 5);
}

function getExamTypeLabel(
  examType: InstructorExam["examType"],
) {
  return (
    examTypes.find((type) => type.value === examType)
      ?.label ?? examType
  );
}

export default function EditInstructorExamPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const examId = params.id;

  const {
    data: exam,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useInstructorExam(examId);

  const updateExamMutation =
    useUpdateInstructorExam(examId);

  const [form, setForm] =
    useState<UpdateInstructorExamInput>({
      title: "",
      description: "",
      examType: "QUIZ",
      totalMarks: 100,
      examDate: "",
      startTime: "",
      endTime: "",
      room: "",
    });

  const [errorMessage, setErrorMessage] = useState("");
  const [initialized, setInitialized] =
    useState(false);

  useEffect(() => {
    if (!exam || initialized) {
      return;
    }

    setForm({
      title: exam.title,
      description: exam.description ?? "",
      examType: exam.examType,
      totalMarks: Number(exam.totalMarks),
      examDate: formatDateForInput(exam.examDate),
      startTime: normalizeTime(exam.startTime),
      endTime: normalizeTime(exam.endTime),
      room: exam.room ?? "",
    });

    setInitialized(true);
  }, [exam, initialized]);

  const updateField = <
    K extends keyof UpdateInstructorExamInput,
  >(
    field: K,
    value: UpdateInstructorExamInput[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setErrorMessage("");

    if (!form.title?.trim()) {
      setErrorMessage("Exam title is required.");
      return;
    }

    if (
      !form.totalMarks ||
      form.totalMarks <= 0
    ) {
      setErrorMessage(
        "Total marks must be greater than zero.",
      );
      return;
    }

    if (!form.examDate) {
      setErrorMessage("Exam date is required.");
      return;
    }

    if (
      form.startTime &&
      form.endTime &&
      form.startTime >= form.endTime
    ) {
      setErrorMessage(
        "End time must be later than start time.",
      );
      return;
    }

    try {
      const updatedExam =
        await updateExamMutation.mutateAsync({
          title: form.title.trim(),
          description:
            form.description?.trim() || undefined,
          examType: form.examType,
          totalMarks: Number(form.totalMarks),
          examDate: form.examDate,
          startTime: form.startTime || undefined,
          endTime: form.endTime || undefined,
          room: form.room?.trim() || undefined,
        });

      router.push(
        `/instructor/exams/${updatedExam.id}`,
      );
    } catch (error) {
      console.error(
        "Failed to update instructor exam:",
        error,
      );

      setErrorMessage(
        "Unable to update the exam. Please check your information and try again.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />

        <Card>
          <CardContent className="space-y-6 pt-6">
            {Array.from({ length: 7 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="space-y-2"
                >
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                </div>
              ),
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !exam) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>
              Unable to load exam
            </CardTitle>

            <CardDescription>
              The exam could not be loaded. It may have
              been removed or you may not have access.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={() => {
                void refetch();
              }}
              disabled={isFetching}
            >
              {isFetching
                ? "Trying again..."
                : "Try Again"}
            </Button>

            <Link
              href="/instructor/exams"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Back to Exams
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/instructor"
              className="transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>

            <span>/</span>

            <Link
              href="/instructor/exams"
              className="transition-colors hover:text-foreground"
            >
              Exams
            </Link>

            <span>/</span>

            <Link
              href={`/instructor/exams/${exam.id}`}
              className="max-w-[180px] truncate transition-colors hover:text-foreground"
            >
              {exam.title}
            </Link>

            <span>/</span>

            <span className="text-foreground">
              Edit
            </span>
          </div>

          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ClipboardEdit className="size-5" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Edit Exam
                </h1>

                <Badge
                  variant={
                    exam.isPublished
                      ? "default"
                      : "secondary"
                  }
                >
                  {exam.isPublished
                    ? "Published"
                    : "Draft"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                Update the examination information below.
              </p>
            </div>
          </div>
        </div>

        <Link
          href={`/instructor/exams/${exam.id}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Details
        </Link>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        {/* Main form */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Information</CardTitle>

            <CardDescription>
              Modify the information for this examination.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Section — read only */}
            <div className="space-y-2">
              <Label>Section</Label>

              <div className="rounded-md border bg-muted/40 px-3 py-2.5">
                <p className="text-sm font-medium">
                  {exam.section.sectionCode} —{" "}
                  {exam.section.name}
                </p>

                {exam.courseOffering?.course && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {exam.courseOffering.course.code} —{" "}
                    {exam.courseOffering.course.title}
                  </p>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                The section cannot be changed after the
                exam has been created.
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Exam Title{" "}
                <span className="text-destructive">
                  *
                </span>
              </Label>

              <Input
                id="title"
                value={form.title ?? ""}
                onChange={(event) =>
                  updateField(
                    "title",
                    event.target.value,
                  )
                }
                placeholder="e.g. Midterm Examination"
                maxLength={200}
              />
            </div>

            {/* Type + Marks */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="examType">
                  Exam Type{" "}
                  <span className="text-destructive">
                    *
                  </span>
                </Label>

                <select
                  id="examType"
                  value={form.examType}
                  onChange={(event) =>
                    updateField(
                      "examType",
                      event.target
                        .value as UpdateInstructorExamInput["examType"],
                    )
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                  {examTypes.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                    >
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalMarks">
                  Total Marks{" "}
                  <span className="text-destructive">
                    *
                  </span>
                </Label>

                <Input
                  id="totalMarks"
                  type="number"
                  min={1}
                  value={form.totalMarks ?? ""}
                  onChange={(event) =>
                    updateField(
                      "totalMarks",
                      Number(event.target.value),
                    )
                  }
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="examDate">
                Exam Date{" "}
                <span className="text-destructive">
                  *
                </span>
              </Label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="examDate"
                  type="date"
                  value={form.examDate ?? ""}
                  onChange={(event) =>
                    updateField(
                      "examDate",
                      event.target.value,
                    )
                  }
                  className="pl-9"
                />
              </div>
            </div>

            {/* Time */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">
                  Start Time
                </Label>

                <Input
                  id="startTime"
                  type="time"
                  value={form.startTime ?? ""}
                  onChange={(event) =>
                    updateField(
                      "startTime",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">
                  End Time
                </Label>

                <Input
                  id="endTime"
                  type="time"
                  value={form.endTime ?? ""}
                  onChange={(event) =>
                    updateField(
                      "endTime",
                      event.target.value,
                    )
                  }
                />
              </div>
            </div>

            {/* Room */}
            <div className="space-y-2">
              <Label htmlFor="room">
                Room
              </Label>

              <Input
                id="room"
                value={form.room ?? ""}
                onChange={(event) =>
                  updateField(
                    "room",
                    event.target.value,
                  )
                }
                placeholder="e.g. Room 301"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description
              </Label>

              <textarea
                id="description"
                value={form.description ?? ""}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value,
                  )
                }
                placeholder="Add instructions or additional exam information..."
                rows={5}
                maxLength={2000}
                className="flex w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errorMessage}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Link
                href={`/instructor/exams/${exam.id}`}
                className={`inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground ${
                  updateExamMutation.isPending
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                Cancel
              </Link>

              <Button
                type="submit"
                disabled={
                  updateExamMutation.isPending
                }
              >
                {updateExamMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Exam summary */}
        <Card className="h-fit lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle>Exam Summary</CardTitle>

            <CardDescription>
              Current examination information.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Course */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Course
              </p>

              <p className="mt-1 font-medium">
                {exam.courseOffering?.course?.code ??
                  "—"}
              </p>

              <p className="text-sm text-muted-foreground">
                {exam.courseOffering?.course?.title ??
                  "Course"}
              </p>
            </div>

            {/* Section */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                Section
              </span>

              <Badge variant="secondary">
                {exam.section.sectionCode}
              </Badge>
            </div>

            {/* Type */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                Type
              </span>

              <span className="text-sm font-medium">
                {getExamTypeLabel(exam.examType)}
              </span>
            </div>

            {/* Marks */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                Total Marks
              </span>

              <span className="text-sm font-medium">
                {exam.totalMarks}
              </span>
            </div>

            {/* Students */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                Students
              </span>

              <span className="text-sm font-medium">
                {exam.section.enrolledCount ?? 0}
              </span>
            </div>

            {/* Status */}
            <div className="border-t pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </p>

              <Badge
                className="mt-2"
                variant={
                  exam.isPublished
                    ? "default"
                    : "secondary"
                }
              >
                {exam.isPublished
                  ? "Published"
                  : "Draft"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}