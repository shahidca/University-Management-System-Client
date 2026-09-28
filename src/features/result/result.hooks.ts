import { useQuery } from "@tanstack/react-query";

import {
  getMyCgpa,
  getMyResults,
  getMySemesterGpa,
  getResultById,
} from "./result.service";

import type { ResultListQuery } from "./result.types";

export const resultQueryKeys = {
  all: ["results"] as const,

  my: (query?: ResultListQuery) =>
    [...resultQueryKeys.all, "my", query] as const,

  detail: (id: string) =>
    [...resultQueryKeys.all, "detail", id] as const,

  semesterGpa: (semesterId: string) =>
    [
      ...resultQueryKeys.all,
      "semester-gpa",
      semesterId,
    ] as const,

  cgpa: () =>
    [...resultQueryKeys.all, "cgpa"] as const,
};

export function useMyResults(
  query?: ResultListQuery,
) {
  return useQuery({
    queryKey: resultQueryKeys.my(query),
    queryFn: () => getMyResults(query),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useResult(id: string) {
  return useQuery({
    queryKey: resultQueryKeys.detail(id),
    queryFn: () => getResultById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useMySemesterGpa(
  semesterId: string,
) {
  return useQuery({
    queryKey:
      resultQueryKeys.semesterGpa(semesterId),
    queryFn: () =>
      getMySemesterGpa(semesterId),
    enabled: Boolean(semesterId),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useMyCgpa() {
  return useQuery({
    queryKey: resultQueryKeys.cgpa(),
    queryFn: getMyCgpa,
    staleTime: 60 * 1000,
    retry: 1,
  });
}