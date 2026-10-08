"use client";

import {
  AlertCircle,
  ArrowLeft,
  Mail,
  Phone,
  RefreshCw,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useMyStudents } from "@/features/instructor/instructor.hooks";

export default function InstructorStudentsPage() {
  const {
    data: students,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useMyStudents();

  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    if (!students) {
      return [];
    }

    const query = search.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter((student) => {
      const fullName =
        `${student.firstName} ${student.lastName}`.toLowerCase();

      return (
        fullName.includes(query) ||
        student.studentId?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query) ||
        student.program?.name?.toLowerCase().includes(query) ||
        student.program?.code?.toLowerCase().includes(query) ||
        student.department?.name?.toLowerCase().includes(query) ||
        student.department?.code?.toLowerCase().includes(query)
      );
    });
  }, [students, search]);

  const totalStudents = students?.length ?? 0;
  const activeStudents =
    students?.filter((student) => student.isActive !== false).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/instructor"
              className="transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>

            <span>/</span>

            <span className="text-foreground">
              Students
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Students
          </h1>

          <p className="text-sm text-muted-foreground sm:text-base">
            View students enrolled in your assigned sections.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`size-4 ${
              isFetching ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Students
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight">
                {isLoading ? "—" : totalStudents}
              </p>
            </div>

            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <Users className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Students
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight">
                {isLoading ? "—" : activeStudents}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
              <UserRound className="size-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, student ID, email, program..."
            className="h-10 w-full rounded-lg border bg-background pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Error */}
      {isError && !isLoading && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-destructive/10 p-3 text-destructive">
              <AlertCircle className="size-6" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              Unable to load students
            </h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Something went wrong while loading your students.
              Please try again.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <RefreshCw className="size-4" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-muted" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-muted" />
                  <div className="h-3 w-24 rounded bg-muted" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-4/5 rounded bg-muted" />
                <div className="h-3 w-3/5 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading &&
        !isError &&
        students &&
        students.length === 0 && (
          <div className="rounded-xl border bg-card p-10 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-4">
                <Users className="size-7 text-muted-foreground" />
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                No students yet
              </h2>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Students enrolled in your assigned sections will
                appear here.
              </p>
            </div>
          </div>
        )}

      {/* No search results */}
      {!isLoading &&
        !isError &&
        students &&
        students.length > 0 &&
        filteredStudents.length === 0 && (
          <div className="rounded-xl border bg-card p-10 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-4">
                <Search className="size-7 text-muted-foreground" />
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                No matching students
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Try searching with a different name, ID, email, or
                program.
              </p>
            </div>
          </div>
        )}

      {/* Students */}
      {!isLoading &&
        !isError &&
        filteredStudents.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Students
              </h2>

              <p className="text-sm text-muted-foreground">
                {filteredStudents.length}{" "}
                {filteredStudents.length === 1
                  ? "student"
                  : "students"}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredStudents.map((student) => {
                const fullName = `${student.firstName} ${student.lastName}`;

                return (
                  <div
                    key={student.id}
                    className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* Student header */}
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserRound className="size-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate font-semibold">
                              {fullName}
                            </h3>

                            {student.studentId && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                ID: {student.studentId}
                              </p>
                            )}
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                              student.isActive === false
                                ? "bg-muted text-muted-foreground"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {student.isActive === false
                              ? "Inactive"
                              : "Active"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="mt-5 space-y-2.5">
                      {student.email && (
                        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <Mail className="size-4 shrink-0" />
                          <span className="truncate">
                            {student.email}
                          </span>
                        </div>
                      )}

                      {student.phone && (
                        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <Phone className="size-4 shrink-0" />
                          <span>{student.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Academic information */}
                    {(student.program || student.department) && (
                      <div className="mt-5 border-t pt-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Academic Information
                        </p>

                        <div className="space-y-2">
                          {student.program && (
                            <div className="flex items-start justify-between gap-4 text-sm">
                              <span className="text-muted-foreground">
                                Program
                              </span>

                              <span className="text-right font-medium">
                                {student.program.code
                                  ? `${student.program.code} — `
                                  : ""}
                                {student.program.name ?? "N/A"}
                              </span>
                            </div>
                          )}

                          {student.program?.degree && (
                            <div className="flex items-center justify-between gap-4 text-sm">
                              <span className="text-muted-foreground">
                                Degree
                              </span>

                              <span className="font-medium">
                                {student.program.degree}
                              </span>
                            </div>
                          )}

                          {student.department && (
                            <div className="flex items-start justify-between gap-4 text-sm">
                              <span className="text-muted-foreground">
                                Department
                              </span>

                              <span className="text-right font-medium">
                                {student.department.code
                                  ? `${student.department.code} — `
                                  : ""}
                                {student.department.name ?? "N/A"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
}