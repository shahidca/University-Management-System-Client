import { useQuery } from "@tanstack/react-query";

import { getStudentProfile } from "./student.service";

export const studentQueryKeys = {
  all: ["student"] as const,
  profile: () => [...studentQueryKeys.all, "profile"] as const,
};

export function useStudentProfile() {
  return useQuery({
    queryKey: studentQueryKeys.profile(),
    queryFn: getStudentProfile,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}