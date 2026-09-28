import { apiRequest } from "@/services";

import type {
  Result,
  ResultListQuery,
  ResultListResponse,
  StudentCgpa,
  StudentSemesterGpa,
} from "./result.types";

export function getMyResults(
  query?: ResultListQuery,
): Promise<ResultListResponse> {
  return apiRequest<ResultListResponse>({
    method: "GET",
    url: "/results",
    params: query,
  });
}

export function getResultById(
  id: string,
): Promise<Result> {
  return apiRequest<Result>({
    method: "GET",
    url: `/results/${id}`,
  });
}

export function getMySemesterGpa(
  semesterId: string,
): Promise<StudentSemesterGpa> {
  return apiRequest<StudentSemesterGpa>({
    method: "GET",
    url: `/results/gpa/${semesterId}`,
  });
}

export function getMyCgpa(): Promise<StudentCgpa> {
  return apiRequest<StudentCgpa>({
    method: "GET",
    url: "/results/cgpa",
  });
}