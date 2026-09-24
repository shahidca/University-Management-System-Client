import axios from "axios";

import { env } from "@/lib/env";

export interface HealthResponse {
  success: boolean;
  message: string;
  data?: {
    status?: string;
  };
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await axios.get<HealthResponse>(
    `${env.apiOrigin}/health`,
    {
      timeout: 15000,
    },
  );

  return response.data;
}