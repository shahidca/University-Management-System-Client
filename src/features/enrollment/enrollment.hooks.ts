import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createEnrollment,
  dropEnrollment,
  getEnrollmentById,
  getMyEnrollments,
} from "./enrollment.service";

import type {
  CreateEnrollmentInput,
  EnrollmentListQuery,
} from "./enrollment.types";

export const enrollmentQueryKeys = {
  all: ["enrollments"] as const,

  my: (query?: EnrollmentListQuery) =>
    [...enrollmentQueryKeys.all, "my", query] as const,

  detail: (id: string) =>
    [...enrollmentQueryKeys.all, "detail", id] as const,
};

export function useMyEnrollments(
  query?: EnrollmentListQuery,
) {
  return useQuery({
    queryKey: enrollmentQueryKeys.my(query),
    queryFn: () => getMyEnrollments(query),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useEnrollment(
  id: string,
) {
  return useQuery({
    queryKey: enrollmentQueryKeys.detail(id),
    queryFn: () => getEnrollmentById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      input: CreateEnrollmentInput,
    ) => createEnrollment(input),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: enrollmentQueryKeys.all,
      });

      void queryClient.invalidateQueries({
        queryKey: ["student"],
      });
    },
  });
}

export function useDropEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      dropEnrollment(id),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: enrollmentQueryKeys.all,
      });

      void queryClient.invalidateQueries({
        queryKey: ["student"],
      });
    },
  });
}