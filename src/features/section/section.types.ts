export interface SectionCourseOffering {
  id: string;
  courseId: string;
  semesterId: string;
  code: string;
  title: string;
  credits: number | string;
  isActive: boolean;
}

export interface SectionInstructor {
  id: string;
  userId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  designation: string;
  isActive: boolean;
}

export interface SectionCounts {
  enrollments: number;
  exams: number;
  schedules: number;
}

export interface Section {
  id: string;
  courseOfferingId: string;
  instructorId: string;
  sectionCode: string;
  name: string;
  capacity: number;
  enrolledCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  courseOffering: SectionCourseOffering;
  instructor: SectionInstructor;

  _count: SectionCounts;
}

export interface SectionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SectionListResponse {
  items: Section[];
  pagination: SectionPagination;
}

export interface SectionListQuery {
  page?: number;
  limit?: number;
  courseOfferingId?: string;
  instructorId?: string;
  isActive?: boolean;
  search?: string;
  sortBy?:
    | "sectionCode"
    | "name"
    | "capacity"
    | "enrolledCount"
    | "createdAt";
  sortOrder?: "asc" | "desc";
}