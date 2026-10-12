import { apiRequest } from "@/services";

import type {
  CreateInstructorAttendanceInput,
  CreateInstructorExamInput,
  CreateInstructorResultInput,
  InstructorAttendanceListResponse,
  InstructorAttendanceRecord,
  InstructorAttendanceSummary,
  InstructorEnrollment,
  InstructorExam,
  InstructorExamResult,
  InstructorProfile,
  InstructorSection,
  InstructorStudent,
  UpdateInstructorAttendanceInput,
  UpdateInstructorExamInput,
  UpdateInstructorResultInput,
} from "./instructor.types";

/*
|--------------------------------------------------------------------------
| Instructor Profile
|--------------------------------------------------------------------------
*/

export function getMyInstructorProfile(): Promise<InstructorProfile> {
  return apiRequest<InstructorProfile>({
    method: "GET",
    url: "/instructors/me",
  });
}

/*
|--------------------------------------------------------------------------
| Instructor Sections
|--------------------------------------------------------------------------
*/

export function getMySections(): Promise<InstructorSection[]> {
  return apiRequest<InstructorSection[]>({
    method: "GET",
    url: "/sections/my",
  });
}

/*
|--------------------------------------------------------------------------
| Instructor Students
|--------------------------------------------------------------------------
*/

export function getMyStudents(): Promise<InstructorStudent[]> {
  return apiRequest<InstructorStudent[]>({
    method: "GET",
    url: "/instructors/students",
  });
}

/*
|--------------------------------------------------------------------------
| Instructor Exams
|--------------------------------------------------------------------------
*/

export function getMyExams(): Promise<InstructorExam[]> {
  return apiRequest<InstructorExam[]>({
    method: "GET",
    url: "/exams/my",
  });
}

export function getExamById(
  examId: string,
): Promise<InstructorExam> {
  return apiRequest<InstructorExam>({
    method: "GET",
    url: `/exams/${examId}`,
  });
}

export function createExam(
  input: CreateInstructorExamInput,
): Promise<InstructorExam> {
  return apiRequest<InstructorExam>({
    method: "POST",
    url: "/exams",
    data: input,
  });
}

export function updateExam(
  examId: string,
  input: UpdateInstructorExamInput,
): Promise<InstructorExam> {
  return apiRequest<InstructorExam>({
    method: "PATCH",
    url: `/exams/${examId}`,
    data: input,
  });
}

export function publishExam(
  examId: string,
): Promise<InstructorExam> {
  return apiRequest<InstructorExam>({
    method: "PATCH",
    url: `/exams/${examId}/publish`,
  });
}

export function unpublishExam(
  examId: string,
): Promise<InstructorExam> {
  return apiRequest<InstructorExam>({
    method: "PATCH",
    url: `/exams/${examId}/unpublish`,
  });
}

export function deleteExam(
  examId: string,
): Promise<void> {
  return apiRequest<void>({
    method: "DELETE",
    url: `/exams/${examId}`,
  });
}

/*
|--------------------------------------------------------------------------
| Instructor Exam Results
|--------------------------------------------------------------------------
*/

export function getExamResults(
  examId: string,
): Promise<InstructorExamResult[]> {
  return apiRequest<InstructorExamResult[]>({
    method: "GET",
    url: `/results/exam/${examId}`,
  });
}

export function createExamResult(
  input: CreateInstructorResultInput,
): Promise<InstructorExamResult> {
  return apiRequest<InstructorExamResult>({
    method: "POST",
    url: "/results",
    data: input,
  });
}

export function updateExamResult(
  resultId: string,
  input: UpdateInstructorResultInput,
): Promise<InstructorExamResult> {
  return apiRequest<InstructorExamResult>({
    method: "PATCH",
    url: `/results/${resultId}`,
    data: input,
  });
}

/*
|--------------------------------------------------------------------------
| Instructor Section Enrollments
|--------------------------------------------------------------------------
*/

export function getInstructorSectionEnrollments(
  sectionId: string,
): Promise<InstructorEnrollment[]> {
  return apiRequest<InstructorEnrollment[]>({
    method: "GET",
    url: `/enrollments/section/${sectionId}`,
  });
}

/*
|--------------------------------------------------------------------------
| Instructor Attendance
|--------------------------------------------------------------------------
*/

export function getInstructorAttendance(
  sectionId: string,
): Promise<InstructorAttendanceListResponse> {
  return apiRequest<InstructorAttendanceListResponse>({
    method: "GET",
    url: "/attendance",
    params: {
      sectionId,
      page: 1,
      limit: 100,
      sortBy: "date",
      sortOrder: "desc",
    },
  });
}

export function createInstructorAttendance(
  input: CreateInstructorAttendanceInput,
): Promise<InstructorAttendanceRecord> {
  return apiRequest<InstructorAttendanceRecord>({
    method: "POST",
    url: "/attendance",
    data: input,
  });
}

export function updateInstructorAttendance(
  attendanceId: string,
  input: UpdateInstructorAttendanceInput,
): Promise<InstructorAttendanceRecord> {
  return apiRequest<InstructorAttendanceRecord>({
    method: "PATCH",
    url: `/attendance/${attendanceId}`,
    data: input,
  });
}

export function deleteInstructorAttendance(
  attendanceId: string,
): Promise<{ id: string }> {
  return apiRequest<{ id: string }>({
    method: "DELETE",
    url: `/attendance/${attendanceId}`,
  });
}

export function getInstructorAttendanceSummary(
  enrollmentId: string,
): Promise<InstructorAttendanceSummary> {
  return apiRequest<InstructorAttendanceSummary>({
    method: "GET",
    url: `/attendance/summary/${enrollmentId}`,
  });
}