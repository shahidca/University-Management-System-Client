export type ResultStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED";

export type ResultExamType =
  | "QUIZ"
  | "MIDTERM"
  | "FINAL"
  | "ASSIGNMENT"
  | "PRACTICAL"
  | "VIVA";

export interface ResultCourse {
  id: string;
  code: string;
  title: string;
  credits: number | string;
  courseType: string;
  level: string;
}

export interface ResultSemester {
  id: string;
  name: string;
  code: string;
  status: string;
}

export interface ResultCourseOffering {
  id: string;
  code: string;
  title: string;
  credits: number | string;
  course: ResultCourse;
  semester: ResultSemester;
}

export interface ResultSection {
  id: string;
  sectionCode: string;
  name: string;
  instructorId: string;
  courseOffering: ResultCourseOffering;
}

export interface ResultExam {
  id: string;
  title: string;
  examType: ResultExamType;
  totalMarks: number | string;
  examDate: string;
  startTime: string;
  endTime: string;
  room: string | null;
  isPublished: boolean;
  section: ResultSection;
}

export interface ResultProgram {
  id: string;
  code: string;
  name: string;
  degree: string;
}

export interface ResultStudent {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  program?: ResultProgram;
}

export interface ResultEnrollmentSection {
  id: string;
  sectionCode: string;
  name: string;
}

export interface ResultEnrollment {
  id: string;
  studentId: string;
  sectionId: string;
  status: string;
  enrolledAt: string;
  droppedAt: string | null;
  student: ResultStudent;
  section: ResultEnrollmentSection;
}

export interface Result {
  id: string;
  examId: string;
  enrollmentId: string;
  marksObtained: number | string;
  grade: string | null;
  gradePoint: number | string | null;
  status: ResultStatus;
  remarks: string | null;
  submittedAt: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  exam: ResultExam;
  enrollment: ResultEnrollment;
}

export interface ResultPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ResultListResponse {
  items: Result[];
  pagination: ResultPagination;
}

export interface ResultListQuery {
  page?: number;
  limit?: number;
  examId?: string;
  enrollmentId?: string;
  sectionId?: string;
  status?: ResultStatus;
  grade?: string;
  search?: string;
  sortBy?: "createdAt" | "marksObtained" | "grade";
  sortOrder?: "asc" | "desc";
}

export interface SemesterGpaCourse {
  semesterId: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  grade: string;
  gradePoint: number;
  percentage: number;
  totalMarksObtained: number;
  totalMarks: number;
  exams: {
    examId: string;
    examType: ResultExamType;
    marksObtained: number;
    totalMarks: number;
  }[];
}

export interface StudentSemesterGpa {
  student: ResultStudent;
  semester: {
    id: string;
    name: string;
    code: string;
  };
  gpa: number;
  totalCredits: number;
  courses: SemesterGpaCourse[];
}

export interface StudentCgpa {
  student: ResultStudent;
  cgpa: number;
  totalCredits: number;
  courses: SemesterGpaCourse[];
}