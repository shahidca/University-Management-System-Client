"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardPlus,
  Loader2,
  Save,
} from "lucide-react";
import { useState } from "react";

import {
  useCreateInstructorExam,
  useMySections,
} from "@/features/instructor/instructor.hooks";
import type {
  CreateInstructorExamInput,
  InstructorSection,
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

function getSectionLabel(section: InstructorSection) {
  const course = section.courseOffering?.course;

  const courseLabel = course
    ? `${course.code} — ${course.title}`
    : section.courseOffering?.code ?? "Course";

  return `${courseLabel} • ${section.sectionCode}`;
}

export default function CreateInstructorExamPage() {
  const router = useRouter();

  const {
    data: sections,
    isLoading: sectionsLoading,
    isError: sectionsError,
  } = useMySections();

  const createExamMutation = useCreateInstructorExam();

  const [form, setForm] = useState<CreateInstructorExamInput>({
    sectionId: "",
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

  const updateField = <K extends keyof CreateInstructorExamInput>(
    field: K,
    value: CreateInstructorExamInput[K],
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

    if (!form.sectionId) {
      setErrorMessage("Please select a section.");
      return;
    }

    if (!form.title.trim()) {
      setErrorMessage("Exam title is required.");
      return;
    }

    if (!form.examDate) {
      setErrorMessage("Exam date is required.");
      return;
    }

    if (!form.totalMarks || form.totalMarks <= 0) {
      setErrorMessage("Total marks must be greater than zero.");
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
      const exam = await createExamMutation.mutateAsync({
        sectionId: form.sectionId,
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

      router.push(`/instructor/exams/${exam.id}`);
    } catch (error) {
      console.error(
        "Failed to create instructor exam:",
        error,
      );

      setErrorMessage(
        "Unable to create the exam. Please check your information and try again.",
      );
    }
  };

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

            <span className="text-foreground">
              Create
            </span>
          </div>

          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ClipboardPlus className="size-5" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Create Exam
              </h1>

              <p className="text-sm text-muted-foreground">
                Create a new examination for one of your
                sections.
              </p>
            </div>
          </div>
        </div>

        {/* Back button */}
        <Link
          href="/instructor/exams"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Exams
        </Link>
      </div>

      {/* Main content */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Information</CardTitle>

            <CardDescription>
              Enter the basic information for this
              examination.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Section */}
            <div className="space-y-2">
              <Label htmlFor="section">
                Section{" "}
                <span className="text-destructive">*</span>
              </Label>

              <select
                id="section"
                value={form.sectionId}
                onChange={(event) =>
                  updateField(
                    "sectionId",
                    event.target.value,
                  )
                }
                disabled={sectionsLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  {sectionsLoading
                    ? "Loading sections..."
                    : "Select a section"}
                </option>

                {sections?.map((section) => (
                  <option
                    key={section.id}
                    value={section.id}
                  >
                    {getSectionLabel(section)}
                  </option>
                ))}
              </select>

              {sectionsError && (
                <p className="text-sm text-destructive">
                  Unable to load your sections. Please try
                  again later.
                </p>
              )}
            </div>

            {/* Exam title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Exam Title{" "}
                <span className="text-destructive">*</span>
              </Label>

              <Input
                id="title"
                value={form.title}
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

            {/* Exam type + total marks */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="examType">
                  Exam Type{" "}
                  <span className="text-destructive">*</span>
                </Label>

                <select
                  id="examType"
                  value={form.examType}
                  onChange={(event) =>
                    updateField(
                      "examType",
                      event.target
                        .value as CreateInstructorExamInput["examType"],
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
                  <span className="text-destructive">*</span>
                </Label>

                <Input
                  id="totalMarks"
                  type="number"
                  min={1}
                  value={form.totalMarks}
                  onChange={(event) =>
                    updateField(
                      "totalMarks",
                      Number(event.target.value),
                    )
                  }
                />
              </div>
            </div>

            {/* Exam date */}
            <div className="space-y-2">
              <Label htmlFor="examDate">
                Exam Date{" "}
                <span className="text-destructive">*</span>
              </Label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="examDate"
                  type="date"
                  value={form.examDate}
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
                  value={form.startTime}
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
                  value={form.endTime}
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
              <Label htmlFor="room">Room</Label>

              <Input
                id="room"
                value={form.room}
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
                value={form.description}
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
              {/* Cancel */}
              <Link
                href="/instructor/exams"
                aria-disabled={
                  createExamMutation.isPending
                }
                className={`inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground ${
                  createExamMutation.isPending
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                Cancel
              </Link>

              {/* Submit */}
              <Button
                type="submit"
                disabled={
                  createExamMutation.isPending ||
                  sectionsLoading ||
                  sectionsError
                }
              >
                {createExamMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Create Exam
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="h-fit lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle>Exam Summary</CardTitle>

            <CardDescription>
              Review the selected section before creating.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {form.sectionId ? (
              (() => {
                const selectedSection =
                  sections?.find(
                    (section) =>
                      section.id === form.sectionId,
                  );

                if (!selectedSection) {
                  return (
                    <p className="text-sm text-muted-foreground">
                      Selected section details are
                      unavailable.
                    </p>
                  );
                }

                const course =
                  selectedSection.courseOffering?.course;

                return (
                  <div className="space-y-4">
                    {/* Course */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Course
                      </p>

                      <p className="mt-1 font-medium">
                        {course?.code ?? "—"}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {course?.title ?? "Course"}
                      </p>
                    </div>

                    {/* Section */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">
                        Section
                      </span>

                      <Badge variant="secondary">
                        {selectedSection.sectionCode}
                      </Badge>
                    </div>

                    {/* Students */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">
                        Students
                      </span>

                      <span className="text-sm font-medium">
                        {selectedSection.enrolledCount ??
                          0}
                      </span>
                    </div>

                    {/* Semester */}
                    {selectedSection.courseOffering
                      ?.semester && (
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Semester
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {
                            selectedSection
                              .courseOffering.semester.name
                          }
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {
                            selectedSection
                              .courseOffering.semester.code
                          }
                        </p>
                      </div>
                    )}

                    {/* Exam preview */}
                    <div className="border-t pt-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Exam
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {form.title ||
                          "Untitled examination"}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {form.totalMarks} marks •{" "}
                        {
                          examTypes.find(
                            (type) =>
                              type.value ===
                              form.examType,
                          )?.label
                        }
                      </p>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="rounded-lg border border-dashed p-5 text-center">
                <ClipboardPlus className="mx-auto size-8 text-muted-foreground/60" />

                <p className="mt-3 text-sm font-medium">
                  No section selected
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Select a section to preview its
                  information.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}