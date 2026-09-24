import { apiRequest } from "@/services";

import type {
  AuthUser,
  EmailVerificationInput,
  ForgotPasswordInput,
  GoogleLoginInput,
  LoginInput,
  LoginResponse,
  RefreshInput,
  RefreshResponse,
  RegisterInput,
  RegisterResponse,
  ResendVerificationInput,
  ResetPasswordInput,
} from "./auth.types";

export function register(
  input: RegisterInput,
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>({
    method: "POST",
    url: "/auth/register",
    data: input,
  });
}

export function login(
  input: LoginInput,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>({
    method: "POST",
    url: "/auth/login",
    data: input,
  });
}

export function refreshToken(
  input: RefreshInput,
): Promise<RefreshResponse> {
  return apiRequest<RefreshResponse>({
    method: "POST",
    url: "/auth/refresh",
    data: input,
  });
}

export function logout(
  refreshTokenValue: string,
): Promise<null> {
  return apiRequest<null>({
    method: "POST",
    url: "/auth/logout",
    data: {
      refreshToken: refreshTokenValue,
    },
  });
}

export function getCurrentUser(): Promise<AuthUser> {
  return apiRequest<AuthUser>({
    method: "GET",
    url: "/auth/me",
  });
}

export function googleLogin(
  input: GoogleLoginInput,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>({
    method: "POST",
    url: "/auth/google",
    data: input,
  });
}

export function verifyEmail(
  input: EmailVerificationInput,
): Promise<null> {
  return apiRequest<null>({
    method: "POST",
    url: "/auth/verify-email",
    data: input,
  });
}

export function resendVerification(
  input: ResendVerificationInput,
): Promise<null> {
  return apiRequest<null>({
    method: "POST",
    url: "/auth/resend-verification",
    data: input,
  });
}

export function forgotPassword(
  input: ForgotPasswordInput,
): Promise<null> {
  return apiRequest<null>({
    method: "POST",
    url: "/auth/forgot-password",
    data: input,
  });
}

export function resetPassword(
  input: ResetPasswordInput,
): Promise<null> {
  return apiRequest<null>({
    method: "POST",
    url: "/auth/reset-password",
    data: input,
  });
}