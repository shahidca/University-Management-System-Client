import { useQuery } from "@tanstack/react-query";

import {
  getExamById,
  getMyExams,
} from "./exam.service";

import type { ExamListQuery } from "./exam.types";

export const examQueryKeys = {
  all: ["exams"] as const,

  my: (query?: ExamListQuery) =>
    [...examQueryKeys.all, "my", query] as const,

  detail: (id: string) =>
    [...examQueryKeys.all, "detail", id] as const,
};

export function useMyExams(
  query?: ExamListQuery,
) {
  return useQuery({
    queryKey: examQueryKeys.my(query),
    queryFn: () => getMyExams(query),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useExam(id: string) {
  return useQuery({
    queryKey: examQueryKeys.detail(id),
    queryFn: () => getExamById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
    retry: 1,
  });
}