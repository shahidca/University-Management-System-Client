"use client";

import {
  AlertCircle,
  BookOpen,
  GraduationCap,
  UserRound,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useStudentProfile } from "@/features/student/student.hooks";

export default function StudentDashboardPage() {
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useStudentProfile();

  if (isLoading) {
    return <StudentDashboardSkeleton />;
  }

  if (isError || !profile) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-primary">
            Student Portal
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Dashboard
          </h1>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="size-4" />

          <AlertTitle>
            Unable to load your profile
          </AlertTitle>

          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading your student profile."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">
          Student Portal
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, {profile.firstName}!
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Here&apos;s an overview of your academic profile.
        </p>
      </div>

      {/* Profile summary */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UserRound className="size-8" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">
                  {profile.firstName} {profile.lastName}
                </h2>

                <Badge variant="secondary">
                  Active Student
                </Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Student ID: {profile.studentId}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {profile.phone ?? "No phone number added"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Program
            </CardTitle>

            <GraduationCap className="size-5 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-lg font-semibold">
              {profile.program.name}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {profile.program.code} · {profile.program.degree}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Program Duration
            </CardTitle>

            <BookOpen className="size-5 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">
              {profile.program.durationYears}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Years
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Credits
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">
              {profile.program.totalCredits}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Program credit requirement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Program description */}
      {profile.program.description && (
        <Card>
          <CardHeader>
            <CardTitle>About Your Program</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              {profile.program.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StudentDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-2 h-9 w-64" />
        <Skeleton className="mt-2 h-4 w-80 max-w-full" />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <Skeleton className="size-16 rounded-2xl" />

            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-28" />
            </CardHeader>

            <CardContent>
              <Skeleton className="h-7 w-36" />
              <Skeleton className="mt-2 h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}