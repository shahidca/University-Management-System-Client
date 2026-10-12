import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  InstructorAttendanceRecord,
  InstructorExamResult,
  UpdateInstructorExamInput,
  UpdateInstructorResultInput,
} from "./instructor.types";

import {
  createExam,
  createExamResult,
  createInstructorAttendance,
  deleteExam,
  deleteInstructorAttendance,
  getExamById,
  getExamResults,
  getInstructorAttendance,
  getInstructorAttendanceSummary,
  getInstructorSectionEnrollments,
  getMyExams,
  getMyInstructorProfile,
  getMySections,
  getMyStudents,
  publishExam,
  unpublishExam,
  updateExam,
  updateExamResult,
  updateInstructorAttendance,
} from "./instructor.service";

/*
|--------------------------------------------------------------------------
| Query Keys
|--------------------------------------------------------------------------
*/

export const instructorQueryKeys = {
  all: ["instructor"] as const,

  profile: () =>
    [
      ...instructorQueryKeys.all,
      "profile",
    ] as const,

  sections: () =>
    [
      ...instructorQueryKeys.all,
      "sections",
    ] as const,

  students: () =>
    [
      ...instructorQueryKeys.all,
      "students",
    ] as const,

  exams: () =>
    [
      ...instructorQueryKeys.all,
      "exams",
    ] as const,

  exam: (examId: string) =>
    [
      ...instructorQueryKeys.all,
      "exam",
      examId,
    ] as const,

  examResults: (examId: string) =>
    [
      ...instructorQueryKeys.all,
      "exam-results",
      examId,
    ] as const,

  enrollments: (sectionId: string) =>
    [
      ...instructorQueryKeys.all,
      "enrollments",
      sectionId,
    ] as const,

  attendance: (sectionId: string) =>
    [
      ...instructorQueryKeys.all,
      "attendance",
      sectionId,
    ] as const,

  attendanceSummary: (enrollmentId: string) =>
    [
      ...instructorQueryKeys.all,
      "attendance-summary",
      enrollmentId,
    ] as const,
};

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

export function useMyInstructorProfile() {
  return useQuery({
    queryKey:
      instructorQueryKeys.profile(),

    queryFn:
      getMyInstructorProfile,

    staleTime:
      5 * 60 * 1000,

    retry: 1,
  });
}

/*
|--------------------------------------------------------------------------
| Sections
|--------------------------------------------------------------------------
*/

export function useMySections() {
  return useQuery({
    queryKey:
      instructorQueryKeys.sections(),

    queryFn:
      getMySections,

    staleTime:
      60 * 1000,

    retry: 1,
  });
}

/*
|--------------------------------------------------------------------------
| Students
|--------------------------------------------------------------------------
*/

export function useMyStudents() {
  return useQuery({
    queryKey:
      instructorQueryKeys.students(),

    queryFn:
      getMyStudents,

    staleTime:
      60 * 1000,

    retry: 1,
  });
}

/*
|--------------------------------------------------------------------------
| Exams
|--------------------------------------------------------------------------
*/

export function useMyExams() {
  return useQuery({
    queryKey:
      instructorQueryKeys.exams(),

    queryFn:
      getMyExams,

    staleTime:
      60 * 1000,

    retry: 1,
  });
}

export function useInstructorExam(
  examId: string,
) {
  return useQuery({
    queryKey:
      instructorQueryKeys.exam(examId),

    queryFn: () =>
      getExamById(examId),

    enabled:
      Boolean(examId),

    staleTime:
      60 * 1000,

    retry: 1,
  });
}

/*
|--------------------------------------------------------------------------
| Section Enrollments
|--------------------------------------------------------------------------
*/

export function useInstructorSectionEnrollments(
  sectionId: string,
) {
  return useQuery({
    queryKey:
      instructorQueryKeys.enrollments(
        sectionId,
      ),

    queryFn: () =>
      getInstructorSectionEnrollments(
        sectionId,
      ),

    enabled:
      Boolean(sectionId),

    staleTime:
      60 * 1000,

    retry: 1,
  });
}

/*
|--------------------------------------------------------------------------
| Student Attendance Monitoring
|--------------------------------------------------------------------------
|
| Loads all sections assigned to the instructor, gets the enrollments
| for those sections, finds the requested student, and then loads
| attendance summaries for that student's enrollments.
|
| useQueries is intentionally used here because the number of
| instructor sections is dynamic.
|--------------------------------------------------------------------------
*/

export function useInstructorStudentAttendance(
  studentId: string,
) {
  const {
    data: sections,
    isLoading: isSectionsLoading,
    isError: isSectionsError,
  } = useMySections();

  const sectionIds =
    sections?.map(
      (section) => section.id,
    ) ?? [];

  const enrollmentQueries =
    useQueries({
      queries: sectionIds.map(
        (sectionId) => ({
          queryKey:
            instructorQueryKeys.enrollments(
              sectionId,
            ),

          queryFn: () =>
            getInstructorSectionEnrollments(
              sectionId,
            ),

          enabled:
            Boolean(sectionId) &&
            Boolean(studentId),

          staleTime:
            60 * 1000,

          retry: 1,
        }),
      ),
    });

  const isEnrollmentsLoading =
    enrollmentQueries.some(
      (query) => query.isLoading,
    );

  const isEnrollmentsError =
    enrollmentQueries.some(
      (query) => query.isError,
    );

  const studentEnrollments =
    enrollmentQueries
      .flatMap(
        (query) =>
          query.data ?? [],
      )
      .filter(
        (enrollment) =>
          enrollment.student.id ===
          studentId,
      );

  const attendanceQueries =
    useQueries({
      queries:
        studentEnrollments.map(
          (enrollment) => ({
            queryKey:
              instructorQueryKeys.attendanceSummary(
                enrollment.id,
              ),

            queryFn: () =>
              getInstructorAttendanceSummary(
                enrollment.id,
              ),

            enabled:
              Boolean(enrollment.id),

            staleTime:
              30 * 1000,

            retry: 1,
          }),
        ),
    });

  const isAttendanceLoading =
    attendanceQueries.some(
      (query) => query.isLoading,
    );

  const isAttendanceError =
    attendanceQueries.some(
      (query) => query.isError,
    );

  const attendanceSummaries =
    attendanceQueries
      .map(
        (query) =>
          query.data,
      )
      .filter(
        (
          summary,
        ): summary is NonNullable<
          typeof summary
        > =>
          Boolean(summary),
      );

  return {
    sections,
    studentEnrollments,
    attendanceSummaries,

    isLoading:
      isSectionsLoading ||
      isEnrollmentsLoading ||
      isAttendanceLoading,

    isError:
      isSectionsError ||
      isEnrollmentsError ||
      isAttendanceError,

    hasEnrollments:
      studentEnrollments.length > 0,

    hasAttendance:
      attendanceSummaries.length > 0,
  };
}

/*
|--------------------------------------------------------------------------
| Student Examination Results Monitoring
|--------------------------------------------------------------------------
|
| Loads all exams assigned to the instructor, fetches the results
| for each exam, and filters those results for the requested student.
|
| useQueries is used because the instructor may have a dynamic number
| of exams.
|--------------------------------------------------------------------------
*/

export function useInstructorStudentResults(
  studentId: string,
) {
  const {
    data: exams,
    isLoading: isExamsLoading,
    isError: isExamsError,
  } = useMyExams();

  const resultQueries =
    useQueries({
      queries:
        exams?.map(
          (exam) => ({
            queryKey:
              instructorQueryKeys.examResults(
                exam.id,
              ),

            queryFn: () =>
              getExamResults(
                exam.id,
              ),

            enabled:
              Boolean(exam.id) &&
              Boolean(studentId),

            staleTime:
              30 * 1000,

            retry: 1,
          }),
        ) ?? [],
    });

  const isResultsLoading =
    resultQueries.some(
      (query) => query.isLoading,
    );

  const isResultsError =
    resultQueries.some(
      (query) => query.isError,
    );

  const studentResults =
    resultQueries
      .flatMap(
        (query) =>
          query.data ?? [],
      )
      .filter(
        (result) =>
          result.studentId ===
          studentId,
      );

  return {
    exams,
    studentResults,

    isLoading:
      isExamsLoading ||
      isResultsLoading,

    isError:
      isExamsError ||
      isResultsError,

    hasResults:
      studentResults.length > 0,
  };
}

/*
|--------------------------------------------------------------------------
| Exam Mutations
|--------------------------------------------------------------------------
*/

export function useCreateInstructorExam() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createExam,

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey:
          instructorQueryKeys.exams(),
      });
    },
  });
}

export function useUpdateInstructorExam(
  examId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: UpdateInstructorExamInput,
    ) =>
      updateExam(
        examId,
        input,
      ),

    onSuccess: (
      updatedExam,
    ) => {
      void queryClient.invalidateQueries({
        queryKey:
          instructorQueryKeys.exams(),
      });

      queryClient.setQueryData(
        instructorQueryKeys.exam(
          examId,
        ),
        updatedExam,
      );
    },
  });
}

export function usePublishInstructorExam(
  examId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: () =>
      publishExam(examId),

    onSuccess: (
      updatedExam,
    ) => {
      queryClient.setQueryData(
        instructorQueryKeys.exam(
          examId,
        ),
        updatedExam,
      );

      void queryClient.invalidateQueries({
        queryKey:
          instructorQueryKeys.exams(),
      });
    },
  });
}

export function useUnpublishInstructorExam(
  examId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: () =>
      unpublishExam(examId),

    onSuccess: (
      updatedExam,
    ) => {
      queryClient.setQueryData(
        instructorQueryKeys.exam(
          examId,
        ),
        updatedExam,
      );

      void queryClient.invalidateQueries({
        queryKey:
          instructorQueryKeys.exams(),
      });
    },
  });
}

export function useDeleteInstructorExam(
  examId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: () =>
      deleteExam(examId),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey:
          instructorQueryKeys.exams(),
      });

      queryClient.removeQueries({
        queryKey:
          instructorQueryKeys.exam(
            examId,
          ),
      });
    },
  });
}

/*
|--------------------------------------------------------------------------
| Exam Results
|--------------------------------------------------------------------------
*/

export function useInstructorExamResults(
  examId: string,
) {
  return useQuery({
    queryKey:
      instructorQueryKeys.examResults(
        examId,
      ),

    queryFn: () =>
      getExamResults(examId),

    enabled:
      Boolean(examId),

    staleTime:
      60 * 1000,

    retry: 1,
  });
}

export function useCreateInstructorExamResult(
  examId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      createExamResult,

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey:
          instructorQueryKeys.examResults(
            examId,
          ),
      });
    },
  });
}

export function useUpdateInstructorExamResult(
  examId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      resultId,
      input,
    }: {
      resultId: string;
      input: UpdateInstructorResultInput;
    }) =>
      updateExamResult(
        resultId,
        input,
      ),

    onSuccess: (
      updatedResult,
    ) => {
      queryClient.setQueryData(
        instructorQueryKeys.examResults(
          examId,
        ),
        (
          currentResults:
            | InstructorExamResult[]
            | undefined,
        ) =>
          currentResults?.map(
            (result) =>
              result.id ===
              updatedResult.id
                ? updatedResult
                : result,
          ),
      );

      void queryClient.invalidateQueries({
        queryKey:
          instructorQueryKeys.examResults(
            examId,
          ),
      });
    },
  });
}

/*
|--------------------------------------------------------------------------
| Instructor Attendance Queries
|--------------------------------------------------------------------------
*/

export function useInstructorAttendance(
  sectionId: string,
) {
  return useQuery({
    queryKey:
      instructorQueryKeys.attendance(
        sectionId,
      ),

    queryFn: () =>
      getInstructorAttendance(
        sectionId,
      ),

    enabled:
      Boolean(sectionId),

    staleTime:
      30 * 1000,

    retry: 1,
  });
}

export function useInstructorAttendanceSummary(
  enrollmentId: string,
) {
  return useQuery({
    queryKey:
      instructorQueryKeys.attendanceSummary(
        enrollmentId,
      ),

    queryFn: () =>
      getInstructorAttendanceSummary(
        enrollmentId,
      ),

    enabled:
      Boolean(enrollmentId),

    staleTime:
      30 * 1000,

    retry: 1,
  });
}

/*
|--------------------------------------------------------------------------
| Instructor Attendance Mutations
|--------------------------------------------------------------------------
*/

export function useCreateInstructorAttendance(
  sectionId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      createInstructorAttendance,

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey:
          instructorQueryKeys.attendance(
            sectionId,
          ),
      });
    },
  });
}

export function useUpdateInstructorAttendance(
  sectionId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      attendanceId,
      input,
    }: {
      attendanceId: string;

      input: {
        status:
          | "PRESENT"
          | "ABSENT"
          | "LATE"
          | "EXCUSED";

        remarks?: string;
      };
    }) =>
      updateInstructorAttendance(
        attendanceId,
        input,
      ),

    onSuccess: (
      updatedAttendance,
    ) => {
      queryClient.setQueryData(
        instructorQueryKeys.attendance(
          sectionId,
        ),
        (
          currentData:
            | {
                items: InstructorAttendanceRecord[];

                pagination: {
                  page: number;
                  limit: number;
                  total: number;
                  totalPages: number;
                };
              }
            | undefined,
        ) => {
          if (!currentData) {
            return currentData;
          }

          return {
            ...currentData,

            items:
              currentData.items.map(
                (attendance) =>
                  attendance.id ===
                  updatedAttendance.id
                    ? updatedAttendance
                    : attendance,
              ),
          };
        },
      );

      void queryClient.invalidateQueries({
        queryKey:
          instructorQueryKeys.attendance(
            sectionId,
          ),
      });

      void queryClient.invalidateQueries({
        queryKey:
          instructorQueryKeys.attendanceSummary(
            updatedAttendance.enrollmentId,
          ),
      });
    },
  });
}

export function useDeleteInstructorAttendance(
  sectionId: string,
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      deleteInstructorAttendance,

    onSuccess: (
      deletedAttendance,
    ) => {
      queryClient.setQueryData(
        instructorQueryKeys.attendance(
          sectionId,
        ),
        (
          currentData:
            | {
                items: InstructorAttendanceRecord[];

                pagination: {
                  page: number;
                  limit: number;
                  total: number;
                  totalPages: number;
                };
              }
            | undefined,
        ) => {
          if (!currentData) {
            return currentData;
          }

          return {
            ...currentData,

            items:
              currentData.items.filter(
                (attendance) =>
                  attendance.id !==
                  deletedAttendance.id,
              ),

            pagination: {
              ...currentData.pagination,

              total: Math.max(
                0,
                currentData.pagination
                  .total - 1,
              ),
            },
          };
        },
      );

      void queryClient.invalidateQueries({
        queryKey:
          instructorQueryKeys.attendance(
            sectionId,
          ),
      });
    },
  });
}