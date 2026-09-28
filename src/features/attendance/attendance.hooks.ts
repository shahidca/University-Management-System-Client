import { useQuery } from "@tanstack/react-query";

import {
  getAttendanceById,
  getAttendanceSummary,
  getMyAttendance,
} from "./attendance.service";

import type {
  AttendanceListQuery,
} from "./attendance.types";

export const attendanceQueryKeys = {
  all: ["attendance"] as const,

  my: (query?: AttendanceListQuery) =>
    [...attendanceQueryKeys.all, "my", query] as const,

  detail: (id: string) =>
    [...attendanceQueryKeys.all, "detail", id] as const,

  summary: (enrollmentId: string) =>
    [
      ...attendanceQueryKeys.all,
      "summary",
      enrollmentId,
    ] as const,
};

export function useMyAttendance(
  query?: AttendanceListQuery,
) {
  return useQuery({
    queryKey: attendanceQueryKeys.my(query),
    queryFn: () => getMyAttendance(query),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useAttendance(
  id: string,
) {
  return useQuery({
    queryKey: attendanceQueryKeys.detail(id),
    queryFn: () => getAttendanceById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useAttendanceSummary(
  enrollmentId: string,
) {
  return useQuery({
    queryKey:
      attendanceQueryKeys.summary(
        enrollmentId,
      ),
    queryFn: () =>
      getAttendanceSummary(enrollmentId),
    enabled: Boolean(enrollmentId),
    staleTime: 60 * 1000,
    retry: 1,
  });
}