import { useQuery } from "@tanstack/react-query";

import {
  getSectionById,
  getSections,
} from "./section.service";

import type { SectionListQuery } from "./section.types";

export const sectionQueryKeys = {
  all: ["sections"] as const,

  list: (query?: SectionListQuery) =>
    [...sectionQueryKeys.all, "list", query] as const,

  detail: (id: string) =>
    [...sectionQueryKeys.all, "detail", id] as const,
};

export function useSections(
  query?: SectionListQuery,
) {
  return useQuery({
    queryKey: sectionQueryKeys.list(query),

    queryFn: () => getSections(query),

    staleTime: 60 * 1000,

    retry: 1,
  });
}

export function useSection(id: string) {
  return useQuery({
    queryKey: sectionQueryKeys.detail(id),

    queryFn: () => getSectionById(id),

    enabled: Boolean(id),

    staleTime: 60 * 1000,

    retry: 1,
  });
}