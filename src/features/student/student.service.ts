import { apiRequest } from "@/services";

import type {
  CreateStudentProfileInput,
  StudentProfile,
  UpdateStudentProfileInput,
} from "./student.types";

export function getStudentProfile(): Promise<StudentProfile> {
  return apiRequest<StudentProfile>({
    method: "GET",
    url: "/students/profile",
  });
}

export function createStudentProfile(
  input: CreateStudentProfileInput,
): Promise<StudentProfile> {
  return apiRequest<StudentProfile>({
    method: "POST",
    url: "/students/profile",
    data: input,
  });
}

export function updateStudentProfile(
  input: UpdateStudentProfileInput,
): Promise<StudentProfile> {
  return apiRequest<StudentProfile>({
    method: "PATCH",
    url: "/students/profile",
    data: input,
  });
}