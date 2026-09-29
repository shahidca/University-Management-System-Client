import { apiRequest } from "@/services";

import type { StudentTranscript } from "./transcript.types";

export function getMyIssuedTranscripts(): Promise<StudentTranscript[]> {
  return apiRequest<StudentTranscript[]>({
    method: "GET",
    url: "/transcripts/my-issued",
  });
}