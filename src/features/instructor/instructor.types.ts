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