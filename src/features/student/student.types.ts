export interface StudentProgram {
  id: string;
  departmentId: string;
  code: string;
  name: string;
  degree: string;
  durationYears: number;
  totalCredits: number | string;
  description: string | null;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  studentId: string;
  programId: string;

  firstName: string;
  lastName: string;

  dateOfBirth: string | null;
  phone: string | null;
  address: string | null;
  admissionDate: string;

  createdAt: string;
  updatedAt: string;

  program: StudentProgram;
}

export interface CreateStudentProfileInput {
  programId: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
}

export interface UpdateStudentProfileInput {
  dateOfBirth?: string;
  phone?: string;
  address?: string;
}