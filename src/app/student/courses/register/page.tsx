"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Users,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useCreateEnrollment,
} from "@/features/enrollment/enrollment.hooks";
import { useSections } from "@/features/section/section.hooks";
import type { Section } from "@/features/section/section.types";

export default function RegisterCoursesPage() {
  const [selectedSection, setSelectedSection] =
    useState<Section | null>(null);

  const [pendingSectionId, setPendingSectionId] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [registrationError, setRegistrationError] =
    useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useSections({
    page: 1,
    limit: 100,
    isActive: true,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const createEnrollmentMutation =
    useCreateEnrollment();

  const handleRegister = async () => {
    if (!selectedSection) {
      return;
    }

    const section = selectedSection;

    setPendingSectionId(section.id);
    setRegistrationError(null);
    setSuccessMessage(null);

    try {
      await createEnrollmentMutation.mutateAsync({
        sectionId: section.id,
      });

      setSelectedSection(null);

      setSuccessMessage(
        `${section.courseOffering.code} - ${section.courseOffering.title} has been registered successfully.`,
      );
    } catch (error) {
      setRegistrationError(
        getErrorMessage(error),
      );
    } finally {
      setPendingSectionId(null);
    }
  };

  if (isLoading) {
    return <RegisterCoursesSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader />

        <Alert variant="destructive">
          <AlertCircle className="size-4" />

          <AlertTitle>
            Unable to load available courses
          </AlertTitle>

          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading available course sections."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const sections = data?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader />

      {successMessage && (
        <Alert>
          <CheckCircle2 className="size-4" />

          <AlertTitle>
            Registration successful
          </AlertTitle>

          <AlertDescription>
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {registrationError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />

          <AlertTitle>
            Registration failed
          </AlertTitle>

          <AlertDescription>
            {registrationError}
          </AlertDescription>
        </Alert>
      )}

      <RegistrationInfo />

      {sections.length === 0 ? (
        <EmptySections />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isPending={
                pendingSectionId === section.id
              }
              onRegister={() =>
                setSelectedSection(section)
              }
            />
          ))}
        </div>
      )}

      <RegistrationDialog
        section={selectedSection}
        open={Boolean(selectedSection)}
        isPending={Boolean(pendingSectionId)}
        onOpenChange={(open) => {
          if (!open && !pendingSectionId) {
            setSelectedSection(null);
          }
        }}
        onConfirm={handleRegister}
      />
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">
          Student Portal
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Register Courses
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Browse available course sections and register
          for the courses you need this semester.
        </p>
      </div>

      <Link
        href="/student/courses"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        My Courses
      </Link>
    </div>
  );
}

function RegistrationInfo() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex gap-4 p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <GraduationCap className="size-5" />
        </div>

        <div>
          <h2 className="font-semibold">
            Before you register
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Registration is subject to prerequisite,
            schedule, credit-limit, seat-availability,
            and semester registration rules. The university
            system will validate these requirements when you
            submit your registration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionCard({
  section,
  isPending,
  onRegister,
}: {
  section: Section;
  isPending: boolean;
  onRegister: () => void;
}) {
  const course = section.courseOffering;

  const availableSeats =
    section.capacity - section.enrolledCount;

  const isFull = availableSeats <= 0;

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {course.code}
              </Badge>

              <Badge variant="secondary">
                Section {section.sectionCode}
              </Badge>
            </div>

            <CardTitle className="mt-3 line-clamp-2 text-lg">
              {course.title}
            </CardTitle>
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="size-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        <div className="grid grid-cols-2 gap-4">
          <InfoItem
            icon={GraduationCap}
            label="Credits"
            value={String(course.credits)}
          />

          <InfoItem
            icon={Users}
            label="Section"
            value={section.sectionCode}
          />

          <InfoItem
            icon={CalendarDays}
            label="Semester"
            value={course.semesterId}
          />

          <InfoItem
            icon={Users}
            label="Seats"
            value={`${section.enrolledCount}/${section.capacity}`}
          />
        </div>

        <div className="rounded-xl border bg-muted/20 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Instructor
          </p>

          <p className="mt-1 text-sm font-semibold">
            {section.instructor.firstName}{" "}
            {section.instructor.lastName}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {section.instructor.designation}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Availability
            </p>

            <p
              className={`mt-1 text-sm font-semibold ${
                isFull
                  ? "text-destructive"
                  : "text-foreground"
              }`}
            >
              {isFull
                ? "Section Full"
                : `${availableSeats} seat${
                    availableSeats === 1 ? "" : "s"
                  } available`}
            </p>
          </div>

          <Button
            type="button"
            disabled={isFull || isPending}
            onClick={onRegister}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RegistrationDialog({
  section,
  open,
  isPending,
  onOpenChange,
  onConfirm,
}: {
  section: Section | null;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  if (!section) {
    return null;
  }

  const course = section.courseOffering;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Confirm course registration
          </DialogTitle>

          <DialogDescription>
            Please review the course details before
            confirming your registration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Course
            </p>

            <p className="mt-1 font-semibold">
              {course.code} — {course.title}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">
                Section
              </p>

              <p className="mt-1 text-sm font-medium">
                {section.sectionCode}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Credits
              </p>

              <p className="mt-1 text-sm font-medium">
                {String(course.credits)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Instructor
              </p>

              <p className="mt-1 text-sm font-medium">
                {section.instructor.firstName}{" "}
                {section.instructor.lastName}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Available Seats
              </p>

              <p className="mt-1 text-sm font-medium">
                {section.capacity -
                  section.enrolledCount}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" />
                Confirm Registration
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4 shrink-0" />

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}

function EmptySections() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BookOpen className="size-7" />
        </div>

        <h2 className="mt-5 text-lg font-semibold">
          No courses available
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          There are currently no active course sections
          available for registration.
        </p>

        <Link
          href="/student/courses"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
          Back to My Courses
        </Link>
      </CardContent>
    </Card>
  );
}

function RegisterCoursesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-9 w-52" />
          <Skeleton className="mt-2 h-4 w-full max-w-xl" />
        </div>

        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex gap-4">
            <Skeleton className="size-10 rounded-xl" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full max-w-2xl" />
              <Skeleton className="h-4 w-full max-w-xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between gap-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-6 w-48" />
                </div>

                <Skeleton className="size-10 rounded-xl" />
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map(
                  (_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="space-y-2"
                    >
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ),
                )}
              </div>

              <Skeleton className="h-20 w-full rounded-xl" />

              <div className="flex justify-between">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return "Unable to register for this course. Please try again.";
}