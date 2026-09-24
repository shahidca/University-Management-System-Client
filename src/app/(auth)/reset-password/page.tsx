"use client";

import { useState } from "react";
import Link from "next/link";
import {
      ArrowLeft,
      CheckCircle2,
      Eye,
      EyeOff,
      KeyRound,
      LockKeyhole,
      Mail,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
      resetPasswordSchema,
      type ResetPasswordFormValues,
} from "@/features/auth/auth.validation";

import { resetPassword } from "@/features/auth/auth.service";
import { getApiErrorMessage } from "@/services/api-error";
import { ROUTES } from "@/constants/routes";

export default function ResetPasswordPage() {
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] =
            useState(false);
      const [success, setSuccess] = useState(false);
      const [serverError, setServerError] = useState("");

      const {
            register,
            handleSubmit,
            setValue,
            formState: { errors, isSubmitting },
      } = useForm<ResetPasswordFormValues>({
            resolver: zodResolver(resetPasswordSchema),
            defaultValues: {
                  email: "",
                  otp: "",
                  newPassword: "",
                  confirmPassword: "",
            },
      });

      const onSubmit = async (
            values: ResetPasswordFormValues,
      ) => {
            setServerError("");

            try {
                  await resetPassword({
                        email: values.email,
                        otp: values.otp,
                        newPassword: values.newPassword,
                  });

                  setSuccess(true);
            } catch (error) {
                  setServerError(getApiErrorMessage(error));
            }
      };

      return (
            <AuthShell mode="login">
                  <div className="w-full max-w-md">
                        {success ? (
                              <div className="space-y-7">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                          <CheckCircle2 className="h-7 w-7" />
                                    </div>

                                    <div className="space-y-3">
                                          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                                                Password updated
                                          </p>

                                          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                                You&apos;re all set
                                          </h1>

                                          <p className="text-sm leading-6 text-muted-foreground">
                                                Your password has been changed successfully. All
                                                previous refresh sessions have been revoked for
                                                security.
                                          </p>
                                    </div>

                                    <div className="rounded-2xl border bg-muted/40 p-4">
                                          <div className="flex gap-3">
                                                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                                                <div className="space-y-1">
                                                      <p className="text-sm font-medium">
                                                            Your account is secure
                                                      </p>

                                                      <p className="text-xs leading-5 text-muted-foreground">
                                                            Sign in using your new password to continue to
                                                            UniCore.
                                                      </p>
                                                </div>
                                          </div>
                                    </div>

                                    <Link href={ROUTES.AUTH.LOGIN}>
                                          <Button className="h-11 w-full">
                                                Continue to login
                                          </Button>
                                    </Link>
                              </div>
                        ) : (
                              <div className="space-y-8">
                                    <div className="space-y-3">
                                          <Link href={ROUTES.AUTH.RESET_PASSWORD}>
                                                <Button className="h-11 w-full">
                                                      Enter reset code
                                                </Button>
                                          </Link>
                                          <Link
                                                href={ROUTES.AUTH.LOGIN}
                                                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                          >
                                                <ArrowLeft className="h-4 w-4" />
                                                Back to login
                                          </Link>

                                          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                                                Secure recovery
                                          </p>

                                          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                                Reset your password
                                          </h1>

                                          <p className="text-sm leading-6 text-muted-foreground">
                                                Enter the six-digit code sent to your email and
                                                choose a new password for your UniCore account.
                                          </p>
                                    </div>

                                    <form
                                          onSubmit={handleSubmit(onSubmit)}
                                          className="space-y-5"
                                    >
                                          {/* Email */}
                                          <div className="space-y-2">
                                                <Label htmlFor="email">Email address</Label>

                                                <div className="relative">
                                                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                                      <Input
                                                            id="email"
                                                            type="email"
                                                            autoComplete="email"
                                                            placeholder="you@example.com"
                                                            className="h-11 pl-10"
                                                            {...register("email")}
                                                      />
                                                </div>

                                                {errors.email && (
                                                      <p className="text-xs font-medium text-destructive">
                                                            {errors.email.message}
                                                      </p>
                                                )}
                                          </div>

                                          {/* OTP */}
                                          <div className="space-y-2">
                                                <Label htmlFor="otp">Reset code</Label>

                                                <div className="relative">
                                                      <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                                      <Input
                                                            id="otp"
                                                            inputMode="numeric"
                                                            autoComplete="one-time-code"
                                                            maxLength={6}
                                                            placeholder="000000"
                                                            className="h-11 pl-10 text-center font-mono text-lg tracking-[0.45em]"
                                                            {...register("otp")}
                                                            onInput={(event) => {
                                                                  const value = event.currentTarget.value
                                                                        .replace(/\D/g, "")
                                                                        .slice(0, 6);

                                                                  setValue("otp", value, {
                                                                        shouldValidate: true,
                                                                        shouldDirty: true,
                                                                  });
                                                            }}
                                                      />
                                                </div>

                                                <div className="flex items-center justify-between gap-3">
                                                      {errors.otp ? (
                                                            <p className="text-xs font-medium text-destructive">
                                                                  {errors.otp.message}
                                                            </p>
                                                      ) : (
                                                            <p className="text-xs text-muted-foreground">
                                                                  Enter the 6-digit code from your email.
                                                            </p>
                                                      )}

                                                      <Link
                                                            href={ROUTES.AUTH.FORGOT_PASSWORD}
                                                            className="shrink-0 text-xs font-medium text-primary hover:underline"
                                                      >
                                                            Request new code
                                                      </Link>
                                                </div>
                                          </div>

                                          {/* New password */}
                                          <div className="space-y-2">
                                                <Label htmlFor="newPassword">
                                                      New password
                                                </Label>

                                                <div className="relative">
                                                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                                      <Input
                                                            id="newPassword"
                                                            type={showPassword ? "text" : "password"}
                                                            autoComplete="new-password"
                                                            placeholder="Create a new password"
                                                            className="h-11 pl-10 pr-11"
                                                            {...register("newPassword")}
                                                      />

                                                      <button
                                                            type="button"
                                                            onClick={() =>
                                                                  setShowPassword((value) => !value)
                                                            }
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                                            aria-label={
                                                                  showPassword
                                                                        ? "Hide password"
                                                                        : "Show password"
                                                            }
                                                      >
                                                            {showPassword ? (
                                                                  <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                  <Eye className="h-4 w-4" />
                                                            )}
                                                      </button>
                                                </div>

                                                {errors.newPassword ? (
                                                      <p className="text-xs font-medium text-destructive">
                                                            {errors.newPassword.message}
                                                      </p>
                                                ) : (
                                                      <p className="text-xs text-muted-foreground">
                                                            Use at least 8 characters.
                                                      </p>
                                                )}
                                          </div>

                                          {/* Confirm password */}
                                          <div className="space-y-2">
                                                <Label htmlFor="confirmPassword">
                                                      Confirm new password
                                                </Label>

                                                <div className="relative">
                                                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                                      <Input
                                                            id="confirmPassword"
                                                            type={
                                                                  showConfirmPassword
                                                                        ? "text"
                                                                        : "password"
                                                            }
                                                            autoComplete="new-password"
                                                            placeholder="Confirm your new password"
                                                            className="h-11 pl-10 pr-11"
                                                            {...register("confirmPassword")}
                                                      />

                                                      <button
                                                            type="button"
                                                            onClick={() =>
                                                                  setShowConfirmPassword(
                                                                        (value) => !value,
                                                                  )
                                                            }
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                                            aria-label={
                                                                  showConfirmPassword
                                                                        ? "Hide password"
                                                                        : "Show password"
                                                            }
                                                      >
                                                            {showConfirmPassword ? (
                                                                  <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                  <Eye className="h-4 w-4" />
                                                            )}
                                                      </button>
                                                </div>

                                                {errors.confirmPassword && (
                                                      <p className="text-xs font-medium text-destructive">
                                                            {errors.confirmPassword.message}
                                                      </p>
                                                )}
                                          </div>

                                          {/* Server error */}
                                          {serverError && (
                                                <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                                      {serverError}
                                                </div>
                                          )}

                                          {/* Submit */}
                                          <Button
                                                type="submit"
                                                className="h-11 w-full"
                                                disabled={isSubmitting}
                                          >
                                                {isSubmitting
                                                      ? "Updating password..."
                                                      : "Reset password"}
                                          </Button>
                                    </form>

                                    <div className="border-t pt-6 text-center">
                                          <p className="text-sm text-muted-foreground">
                                                Remember your password?{" "}
                                                <Link
                                                      href={ROUTES.AUTH.LOGIN}
                                                      className="font-semibold text-primary hover:underline"
                                                >
                                                      Sign in
                                                </Link>
                                          </p>
                                    </div>
                              </div>
                        )}
                  </div>
            </AuthShell>
      );
}