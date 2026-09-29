export type TranscriptStatus =
  | "GENERATED"
  | "APPROVED"
  | "ISSUED"
  | "REVOKED";

export interface TranscriptProgram {
  id: string;
  code: string;
  name: string;
  degree: string;
}

export interface TranscriptStudent {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  program: TranscriptProgram | null;
}

export interface TranscriptSemester {
  id: string;
  name: string;
  code: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface StudentTranscript {
  id: string;
  studentId: string;
  semesterId: string;
  transcriptNo: string;

  status: TranscriptStatus;

  semesterGpa: number | string;
  cumulativeGpa: number | string;
  totalCredits: number | string;

  issuedAt: string | null;
  approvedAt: string | null;

  createdAt: string;
  updatedAt: string;

  student: TranscriptStudent;
  semester: TranscriptSemester;
}