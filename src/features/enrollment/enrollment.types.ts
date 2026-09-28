export type EnrollmentStatus =
  | "ENROLLED"
  | "DROPPED"
  | "COMPLETED"
  | "CANCELLED";

export interface EnrollmentProgram {
  id: string;
  code: string;
  name: string;
}

export interface EnrollmentStudent {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  program: EnrollmentProgram;
}

export interface EnrollmentCourse {
  id: string;
  code: string;
  title: string;
  credits: number | string;
}

export interface EnrollmentSemester {
  id: string;
  name: string;
  code: string;
  status: string;
  registrationOpen: string;
  registrationClose: string;
}

export interface EnrollmentCourseOffering {
  id: string;
  code: string;
  title: string;
  credits: number | string;
  isActive: boolean;
  course: EnrollmentCourse;
  semester: EnrollmentSemester;
}

export interface EnrollmentSection {
  id: string;
  sectionCode: string;
  name: string;
  capacity: number;
  enrolledCount: number;
  isActive: boolean;
  courseOffering: EnrollmentCourseOffering;
}

export interface Enrollment {
  id: string;
  studentId: string;
  sectionId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  droppedAt: string | null;
  createdAt: string;
  updatedAt: string;

  student: EnrollmentStudent;
  section: EnrollmentSection;
}

export interface EnrollmentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EnrollmentListResponse {
  items: Enrollment[];
  pagination: EnrollmentPagination;
}

export interface EnrollmentListQuery {
  page?: number;
  limit?: number;
  status?: EnrollmentStatus;
  sectionId?: string;
  studentId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateEnrollmentInput {
  sectionId: string;
}