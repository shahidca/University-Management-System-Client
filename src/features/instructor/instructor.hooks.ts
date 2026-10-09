import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createExam,
  getExamById,
  getMyExams,
  getMyInstructorProfile,
  getMySections,
  getMyStudents,
} from "./instructor.service";

export const instructorQueryKeys = {
  all: ["instructor"] as const,

  profile: () =>
    [...instructorQueryKeys.all, "profile"] as const,

  sections: () =>
    [...instructorQueryKeys.all, "sections"] as const,

  students: () =>
    [...instructorQueryKeys.all, "students"] as const,

  exams: () =>
  [...instructorQueryKeys.all, "exams"] as const,
};

export function useMyInstructorProfile() {
  return useQuery({
    queryKey: instructorQueryKeys.profile(),
    queryFn: getMyInstructorProfile,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useMySections() {
  return useQuery({
    queryKey: instructorQueryKeys.sections(),
    queryFn: getMySections,
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useMyStudents() {
  return useQuery({
    queryKey: instructorQueryKeys.students(),
    queryFn: getMyStudents,
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useMyExams() {
  return useQuery({
    queryKey: instructorQueryKeys.exams(),
    queryFn: getMyExams,
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useInstructorExam(
  examId: string,
) {
  return useQuery({
    queryKey: [
      ...instructorQueryKeys.all,
      "exam",
      examId,
    ],
    queryFn: () => getExamById(examId),
    enabled: Boolean(examId),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useCreateInstructorExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExam,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: instructorQueryKeys.exams(),
      });
    },
  });
}