import { apiRequest } from "@/services";

import type {
  Exam,
  ExamListQuery,
  ExamListResponse,
} from "./exam.types";

export function getMyExams(
  query?: ExamListQuery,
): Promise<ExamListResponse> {
  return apiRequest<ExamListResponse>({
    method: "GET",
    url: "/exams/my",
    params: query,
  });
}

export function getExamById(
  id: string,
): Promise<Exam> {
  return apiRequest<Exam>({
    method: "GET",
    url: `/exams/${id}`,
  });
}