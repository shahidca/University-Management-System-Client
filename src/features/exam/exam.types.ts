export type ExamType =
  | "MIDTERM"
  | "FINAL"
  | "QUIZ"
  | "ASSIGNMENT"
  | "PRACTICAL"
  | "VIVA";

export interface ExamCourse {
  id: string;
  code: string;
  title: string;
}

export interface ExamSemester {
  id: string;
  name: string;
  code: string;
  status: string;
}

export interface ExamCourseOffering {
  id: string;
  code: string;
  title: string;
  credits: number | string;
  course: ExamCourse;
  semester: ExamSemester;
}

export interface ExamSection {
  id: string;
  sectionCode: string;
  name: string;
  courseOffering: ExamCourseOffering;
}

export interface Exam {
  id: string;
  sectionId: string;
  title: string;
  type: ExamType;
  date: string;
  startTime: string;
  endTime: string;
  totalMarks: number | string;
  passingMarks: number | string;
  instructions: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  section: ExamSection;
}

export interface ExamPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ExamListResponse {
  items: Exam[];
  pagination: ExamPagination;
}

export interface ExamListQuery {
  page?: number;
  limit?: number;
  sectionId?: string;
  semesterId?: string;
  type?: ExamType;
  dateFrom?: string;
  dateTo?: string;
  isPublished?: boolean;
  sortBy?: "date" | "title" | "createdAt";
  sortOrder?: "asc" | "desc";
}