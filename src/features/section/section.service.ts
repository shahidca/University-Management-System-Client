import { apiRequest } from "@/services";

import type {
  Section,
  SectionListQuery,
  SectionListResponse,
} from "./section.types";

export function getSections(
  query?: SectionListQuery,
): Promise<SectionListResponse> {
  return apiRequest<SectionListResponse>({
    method: "GET",
    url: "/sections",
    params: query,
  });
}

export function getSectionById(
  id: string,
): Promise<Section> {
  return apiRequest<Section>({
    method: "GET",
    url: `/sections/${id}`,
  });
}