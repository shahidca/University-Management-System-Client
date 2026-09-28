import { apiRequest } from "@/services";

import type {
  AttendanceListQuery,
  AttendanceListResponse,
  AttendanceRecord,
  AttendanceSummary,
} from "./attendance.types";

export function getMyAttendance(
  query?: AttendanceListQuery,
): Promise<AttendanceListResponse> {
  return apiRequest<AttendanceListResponse>({
    method: "GET",
    url: "/attendance/my",
    params: query,
  });
}

export function getAttendanceById(
  id: string,
): Promise<AttendanceRecord> {
  return apiRequest<AttendanceRecord>({
    method: "GET",
    url: `/attendance/${id}`,
  });
}

export function getAttendanceSummary(
  enrollmentId: string,
): Promise<AttendanceSummary> {
  return apiRequest<AttendanceSummary>({
    method: "GET",
    url: `/attendance/summary/${enrollmentId}`,
  });
}