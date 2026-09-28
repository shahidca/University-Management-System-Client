import { apiRequest } from "@/services";

import type {
  CreateEnrollmentInput,
  Enrollment,
  EnrollmentListQuery,
  EnrollmentListResponse,
} from "./enrollment.types";

export function getMyEnrollments(
  query?: EnrollmentListQuery,
): Promise<EnrollmentListResponse> {
  return apiRequest<EnrollmentListResponse>({
    method: "GET",
    url: "/enrollments/my",
    params: query,
  });
}

export function createEnrollment(
  input: CreateEnrollmentInput,
): Promise<Enrollment> {
  return apiRequest<Enrollment>({
    method: "POST",
    url: "/enrollments",
    data: input,
  });
}

export function getEnrollmentById(
  id: string,
): Promise<Enrollment> {
  return apiRequest<Enrollment>({
    method: "GET",
    url: `/enrollments/${id}`,
  });
}

export function dropEnrollment(
  id: string,
): Promise<Enrollment> {
  return apiRequest<Enrollment>({
    method: "PATCH",
    url: `/enrollments/${id}/drop`,
  });
}