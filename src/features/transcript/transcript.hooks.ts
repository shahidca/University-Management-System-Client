import { useQuery } from "@tanstack/react-query";

import {
  getMyIssuedTranscripts,
  getTranscriptById,
} from "./transcript.service";

export const transcriptQueryKeys = {
  all: ["transcripts"] as const,

  myIssued: () =>
    [...transcriptQueryKeys.all, "my-issued"] as const,

  detail: (id: string) =>
    [...transcriptQueryKeys.all, "detail", id] as const,
};

export function useMyIssuedTranscripts() {
  return useQuery({
    queryKey: transcriptQueryKeys.myIssued(),
    queryFn: getMyIssuedTranscripts,
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useTranscript(id: string) {
  return useQuery({
    queryKey: transcriptQueryKeys.detail(id),
    queryFn: () => getTranscriptById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
    retry: 1,
  });
}