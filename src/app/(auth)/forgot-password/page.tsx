"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/auth.validation";

import { forgotPassword } from "@/features/auth/auth.service";
import { getApiErrorMessage } from "@/services/api-error";

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError("");

    try {
      await forgotPassword({
        email: values.email,
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
                Check your inbox
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Reset code sent
              </h1>

              <p className="text-sm leading-6 text-muted-foreground">
                If the account exists and is eligible, we&apos;ve sent a
                password reset code to your email address.
              </p>
            </div>

            <div className="rounded-2xl border bg-muted/40 p-4">
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Check your email
                  </p>

                  <p className="text-xs leading-5 text-muted-foreground">
                    The reset code is valid for a limited time. If you
                    don&apos;t receive the email, check your spam folder.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-3">
              <Link
                href="/login"
                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Account recovery
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Forgot your password?
              </h1>

              <p className="text-sm leading-6 text-muted-foreground">
                Enter the email address associated with your UniCore
                account and we&apos;ll send you a password reset code.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
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

              {serverError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {serverError}
                </div>
              )}

              <Button
                type="submit"
                className="h-11 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Sending reset code..."
                  : "Send reset code"}
              </Button>
            </form>

            <div className="border-t pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                  href="/login"
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