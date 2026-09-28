export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "EXCUSED";

export interface AttendanceProgram {
  id: string;
  code: string;
  name: string;
}

export interface AttendanceStudent {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  program: AttendanceProgram;
}

export interface AttendanceCourse {
  id: string;
  code: string;
  title: string;
}

export interface AttendanceSemester {
  id: string;
  name: string;
  code: string;
  status: string;
}

export interface AttendanceCourseOffering {
  id: string;
  code: string;
  title: string;
  credits: number | string;
  course: AttendanceCourse;
  semester: AttendanceSemester;
}

export interface AttendanceSection {
  id: string;
  sectionCode: string;
  name: string;
  instructorId: string;
  courseOffering: AttendanceCourseOffering;
}

export interface AttendanceEnrollment {
  id: string;
  status: string;
  enrolledAt: string;
  student: AttendanceStudent;
  section: AttendanceSection;
}

export interface AttendanceRecord {
  id: string;
  enrollmentId: string;
  date: string;
  status: AttendanceStatus;
  remarks: string | null;
  markedById: string;
  createdAt: string;
  updatedAt: string;
  enrollment: AttendanceEnrollment;
}

export interface AttendancePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AttendanceListResponse {
  items: AttendanceRecord[];
  pagination: AttendancePagination;
}

export interface AttendanceListQuery {
  page?: number;
  limit?: number;
  enrollmentId?: string;
  studentId?: string;
  sectionId?: string;
  markedById?: string;
  status?: AttendanceStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "date" | "status" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface AttendanceSummaryEnrollment {
  id: string;
  status: string;
}

export interface AttendanceSummaryStudent {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
}

export interface AttendanceSummarySection {
  id: string;
  sectionCode: string;
  name: string;
}

export interface AttendanceSummaryCourse {
  code: string;
  title: string;
  offeringCode: string;
  offeringTitle: string;
}

export interface AttendanceSummary {
  enrollment: AttendanceSummaryEnrollment;
  student: AttendanceSummaryStudent;
  section: AttendanceSummarySection;
  course: AttendanceSummaryCourse;
  summary: {
    totalClasses: number;
    present: number;
    late: number;
    absent: number;
    excused: number;
    countedClasses: number;
    attendedClasses: number;
    attendancePercentage: number;
  };
}