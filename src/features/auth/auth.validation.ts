import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required."),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters.")
      .max(50, "First name must not exceed 50 characters."),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters.")
      .max(50, "Last name must not exceed 50 characters."),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(100, "Password must not exceed 100 characters."),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

export const emailVerificationSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  otp: z
    .string()
    .trim()
    .length(6, "Verification code must be 6 digits.")
    .regex(/^\d+$/, "Verification code must contain only numbers."),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address."),

    otp: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Reset code must be exactly 6 digits."),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password must not exceed 128 characters."),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

export type ResetPasswordFormValues =
  z.infer<typeof resetPasswordSchema>;

export type ForgotPasswordFormValues =
  z.infer<typeof forgotPasswordSchema>;

export type LoginFormValues = z.infer<typeof loginSchema>;

export type RegisterFormValues =
  z.infer<typeof registerSchema>;

export type EmailVerificationFormValues =
  z.infer<typeof emailVerificationSchema>;