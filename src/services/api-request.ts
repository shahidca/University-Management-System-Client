import type { AxiosRequestConfig } from "axios";

import { apiClient } from "./api-client";

import type { ApiResponse } from "@/types/common";

export async function apiRequest<T>(
  config: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.request<ApiResponse<T>>(
    config,
  );

  return response.data.data;
}