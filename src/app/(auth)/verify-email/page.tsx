"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MailCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getApiErrorMessage } from "@/services";

import {
  resendVerification,
  verifyEmail,
} from "@/features/auth/auth.service";

import {
  emailVerificationSchema,
  type EmailVerificationFormValues,
} from "@/features/auth/auth.validation";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<EmailVerificationFormValues>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      otp: "",
    },
  });

  const onSubmit = async (
    values: EmailVerificationFormValues,
  ) => {
    setServerError("");
    setSuccessMessage("");

    try {
      await verifyEmail(values);

      setSuccessMessage(
        "Your email has been verified successfully.",
      );

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    }
  };

  const handleResend = async () => {
    const email = getValues("email");

    if (!email) {
      setServerError(
        "Please enter your email address first.",
      );
      return;
    }

    setServerError("");
    setSuccessMessage("");
    setIsResending(true);

    try {
      await resendVerification({ email });

      setSuccessMessage(
        "A new verification code has been sent to your email.",
      );
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  };

  const isBusy = isSubmitting || isResending;

  return (
    <AuthShell mode="verify">
      {/* Back */}
      <Link
        href="/login"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to sign in
      </Link>

      {/* Header */}
      <div className="mb-7">
        <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MailCheck className="size-7" />
        </div>

        <p className="text-sm font-medium text-primary">
          Account verification
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          Verify Your Email
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Enter the 6-digit verification code sent to your
          email address.
        </p>
      </div>

      {/* Verification steps */}
      <div className="mb-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        <VerificationStep
          icon={MailCheck}
          title="Check your inbox"
          description="Look for the verification code"
        />

        <VerificationStep
          icon={ShieldCheck}
          title="Enter the code"
          description="Use the 6-digit code we sent"
        />

        <VerificationStep
          icon={CheckCircle2}
          title="Get started"
          description="Your account will be activated"
        />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email address
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="h-12"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-xs font-medium text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* OTP */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="otp">
              Verification code
            </Label>

            <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
              <Clock3 className="size-3.5" />
              Code expires in 10 minutes
            </span>
          </div>

          <Input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="123456"
            className="h-14 text-center text-xl font-semibold tracking-[0.55em]"
            {...register("otp")}
          />

          {errors.otp && (
            <p className="text-xs font-medium text-destructive">
              {errors.otp.message}
            </p>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm leading-5 text-destructive"
          >
            {serverError}
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm leading-5 text-green-700 dark:text-green-400"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Verify */}
        <Button
          type="submit"
          className="h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/10"
          disabled={isBusy}
        >
          {isSubmitting ? (
            "Verifying..."
          ) : (
            <>
              Verify Email
              <CheckCircle2 className="ml-2 size-4" />
            </>
          )}
        </Button>

        {/* Resend */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={isBusy}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`size-4 ${
                isResending ? "animate-spin" : ""
              }`}
            />

            {isResending
              ? "Sending..."
              : "Resend verification code"}
          </button>
        </div>

        {/* Login */}
        <p className="pt-1 text-center text-sm text-muted-foreground">
          Already verified?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary transition-colors hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

function VerificationStep({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof MailCheck;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}