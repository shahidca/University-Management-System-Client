export interface InstructorUser {
  id: string;
  email: string;
  role: "INSTRUCTOR";
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  emailVerifiedAt: string | null;
}

export interface InstructorProfile {
  id: string;
  userId: string;

  employeeId: string;

  firstName: string;
  lastName: string;

  phone: string | null;

  designation: string | null;
  specialization: string | null;
  qualification: string | null;

  joiningDate: string;

  officeLocation: string | null;
  bio: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;

  user: InstructorUser;
}

export interface InstructorSection {
  id: string;

  courseOfferingId?: string;
  instructorId?: string;

  sectionCode: string;
  name: string;

  capacity?: number | string;
  enrolledCount?: number | string;

  isActive?: boolean;

  courseOffering?: {
    id: string;
    code?: string;
    title?: string;
    credits?: number | string;

    course?: {
      id: string;
      code: string;
      title: string;
      credits?: number | string;
      courseType?: string;
      level?: string;
    };

    semester?: {
      id: string;
      name: string;
      code: string;
      type?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    };
  };

  instructor?: InstructorProfile;

  _count?: {
    enrollments: number;
    exams: number;
    schedules: number;
  };

  createdAt?: string;
  updatedAt?: string;
}

export interface InstructorStudent {
  id: string;

  studentId?: string;

  firstName: string;
  lastName: string;

  email?: string;
  phone?: string | null;

  program?: {
    id: string;
    code?: string;
    name?: string;
    degree?: string;
  } | null;

  department?: {
    id: string;
    code?: string;
    name?: string;
  } | null;

  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface InstructorExam {
  id: string;
  sectionId: string;
  title: string;
  description: string | null;

  examType:
    | "QUIZ"
    | "ASSIGNMENT"
    | "MIDTERM"
    | "FINAL"
    | "VIVA"
    | "PROJECT"
    | "PRESENTATION";

  totalMarks: number | string;

  examDate: string;

  startTime: string | null;
  endTime: string | null;

  room: string | null;

  isPublished: boolean;

  createdAt: string;
  updatedAt: string;

  section: {
    id: string;
    sectionCode: string;
    name: string;

    capacity?: number | string;
    enrolledCount?: number | string;
    isActive?: boolean;
  };

  courseOffering?: {
    id: string;
    code?: string;
    title?: string;
    credits?: number | string;

    course?: {
      id: string;
      code: string;
      title: string;
      credits?: number | string;
    };

    semester?: {
      id: string;
      name: string;
      code: string;
      type?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    };
  };

  _count?: {
    results?: number;
  };
}

export interface CreateInstructorExamInput {
  sectionId: string;

  title: string;

  description?: string;

  examType:
    | "QUIZ"
    | "ASSIGNMENT"
    | "MIDTERM"
    | "FINAL"
    | "VIVA"
    | "PROJECT"
    | "PRESENTATION";

  totalMarks: number;

  examDate: string;

  startTime?: string;
  endTime?: string;

  room?: string;
}

export interface UpdateInstructorExamInput {
  title?: string;

  description?: string;

  examType?:
    | "QUIZ"
    | "ASSIGNMENT"
    | "MIDTERM"
    | "FINAL"
    | "VIVA"
    | "PROJECT"
    | "PRESENTATION";

  totalMarks?: number;

  examDate?: string;

  startTime?: string;
  endTime?: string;

  room?: string;
}

export interface InstructorExamResult {
  id: string;

  examId: string;
  studentId: string;

  marksObtained: number | string;

  grade: string | null;

  gradePoint: number | string | null;

  remarks: string | null;

  isPublished: boolean;

  createdAt: string;
  updatedAt: string;

  student?: {
    id: string;
    studentId: string;

    firstName: string;
    lastName: string;

    email?: string;
  };

  exam?: {
    id: string;

    title: string;

    totalMarks: number | string;

    examType: string;

    examDate: string;

    section?: {
      id: string;
      sectionCode: string;
      name: string;
    };
  };
}

export interface CreateInstructorResultInput {
  examId: string;

  enrollmentId: string;

  marksObtained: number;

  remarks?: string;
}

export interface UpdateInstructorResultInput {
  marksObtained?: number;

  remarks?: string;
}

export interface InstructorEnrollment {
  id: string;

  studentId: string;
  sectionId: string;

  status:
    | "ENROLLED"
    | "DROPPED"
    | "COMPLETED"
    | "CANCELLED";

  createdAt: string;
  updatedAt: string;

  student: {
    id: string;

    studentId: string;

    firstName: string;
    lastName: string;

    email: string;

    phone: string | null;

    program?: {
      id: string;
      code: string;
      name: string;
      degree: string;
    } | null;
  };
}

/*
|--------------------------------------------------------------------------
| Instructor Attendance
|--------------------------------------------------------------------------
*/

export type InstructorAttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "EXCUSED";

export interface InstructorAttendanceRecord {
  id: string;

  enrollmentId: string;

  date: string;

  status: InstructorAttendanceStatus;

  remarks: string | null;

  markedById: string;

  createdAt: string;
  updatedAt: string;

  enrollment: {
    id: string;

    status: string;

    enrolledAt: string;

    student: {
      id: string;

      studentId: string;

      firstName: string;
      lastName: string;

      program: {
        id: string;
        code: string;
        name: string;
      } | null;
    };

    section: {
      id: string;

      sectionCode: string;
      name: string;

      instructorId: string;

      courseOffering: {
        id: string;

        code: string;
        title: string;

        credits: number | string;

        course: {
          id: string;

          code: string;
          title: string;
        };

        semester: {
          id: string;

          name: string;
          code: string;

          status: string;
        };
      };
    };
  };
}

export interface InstructorAttendanceListResponse {
  items: InstructorAttendanceRecord[];

  pagination: {
    page: number;
    limit: number;

    total: number;
    totalPages: number;
  };
}

export interface CreateInstructorAttendanceInput {
  enrollmentId: string;

  date: string;

  status: InstructorAttendanceStatus;

  remarks?: string;
}

export interface UpdateInstructorAttendanceInput {
  status?: InstructorAttendanceStatus;

  remarks?: string;
}

export interface InstructorAttendanceSummary {
  enrollment: {
    id: string;

    status: string;
  };

  student: {
    id: string;

    studentId: string;

    firstName: string;
    lastName: string;
  };

  section: {
    id: string;

    sectionCode: string;
    name: string;
  };

  course: {
    code: string;
    title: string;

    offeringCode: string;
    offeringTitle: string;
  };

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