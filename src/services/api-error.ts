import axios from "axios";

import type { ApiErrorResponse } from "@/types/common";

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      error.message ??
      "Something went wrong while communicating with the server."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while communicating with the server.";
}

export function isApiError(error: unknown): boolean {
  return axios.isAxiosError<ApiErrorResponse>(error);
}