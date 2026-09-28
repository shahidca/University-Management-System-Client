import axios from "axios";

import { env } from "@/lib/env";
import { getAccessToken } from "@/features/auth/auth-storage";

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
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
  (error) => Promise.reject(error),
);