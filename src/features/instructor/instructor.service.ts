import { apiRequest } from "@/services";

import type {
  InstructorExam,
  InstructorProfile,
  InstructorSection,
  InstructorStudent,
} from "./instructor.types";

export function getMyInstructorProfile(): Promise<InstructorProfile> {
  return apiRequest<InstructorProfile>({
    method: "GET",
    url: "/instructors/me",
  });
}

export function getMySections(): Promise<InstructorSection[]> {
  return apiRequest<InstructorSection[]>({
    method: "GET",
    url: "/sections/my",
  });
}

export function getMyStudents(): Promise<InstructorStudent[]> {
  return apiRequest<InstructorStudent[]>({
    method: "GET",
    url: "/instructors/students",
  });
}

export function getMyExams(): Promise<InstructorExam[]> {
  return apiRequest<InstructorExam[]>({
    method: "GET",
    url: "/exams/my",
  });
}