import axios from "axios";

import { getAccessToken } from "@/features/auth/auth-storage";
import { env } from "@/lib/env";

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000,
  withCredentials: true,
});

const publicAuthRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/google",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/auth/forgot-password",
  "/auth/reset-password",
];

apiClient.interceptors.request.use(
  (config) => {
    const requestUrl = config.url ?? "";

    const isPublicAuthRoute = publicAuthRoutes.some(
      (route) => requestUrl === route,
    );

    if (!isPublicAuthRoute) {
      const accessToken = getAccessToken();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        console.error("UniCore API request timed out:", {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          timeout: error.config?.timeout,
          message: error.message,
        });
      } else if (error.response) {
        console.error("UniCore API error:", {
          status: error.response.status,
          statusText: error.response.statusText,
          url: error.config?.url,
          method: error.config?.method,
          data: error.response.data,
        });
      } else if (error.request) {
        console.error("UniCore API network error:", {
          url: error.config?.url,
          method: error.config?.method,
          message: error.message,
        });
      } else {
        console.error("UniCore API request configuration error:", {
          message: error.message,
        });
      }
    } else {
      console.error("Unexpected UniCore API error:", error);
    }

    return Promise.reject(error);
  },
);