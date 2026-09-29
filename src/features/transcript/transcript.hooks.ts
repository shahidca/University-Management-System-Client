import { useQuery } from "@tanstack/react-query";

import { getMyIssuedTranscripts } from "./transcript.service";

export const transcriptQueryKeys = {
  all: ["transcripts"] as const,

  myIssued: () =>
    [...transcriptQueryKeys.all, "my-issued"] as const,
};

export function useMyIssuedTranscripts() {
  return useQuery({
    queryKey: transcriptQueryKeys.myIssued(),
    queryFn: getMyIssuedTranscripts,
    staleTime: 60 * 1000,
    retry: 1,
  });
}