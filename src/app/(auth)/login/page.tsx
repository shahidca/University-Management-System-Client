"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Suspense, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/providers";
import { getApiErrorMessage } from "@/services";

import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/auth.validation";

import { googleLogin } from "@/features/auth/auth.service";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { login } = useAuth();

  const redirectParam =
    searchParams.get("redirect");

  const redirectPath =
    redirectParam &&
    redirectParam.startsWith("/") &&
    !redirectParam.startsWith("//")
      ? redirectParam
      : "/";

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [rememberMe, setRememberMe] =
    useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    values: LoginFormValues,
  ) => {
    setServerError("");

    try {
      await login(values);

      router.replace(redirectPath);
    } catch (error) {
      setServerError(
        getApiErrorMessage(error),
      );
    }
  };

  const handleGoogleLogin = async (
    credential: string,
  ) => {
    setServerError("");
    setIsGoogleSubmitting(true);

    try {
      await googleLogin({
        idToken: credential,
      });

      router.replace(redirectPath);
    } catch (error) {
      setServerError(
        getApiErrorMessage(error),
      );
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const isBusy =
    isSubmitting || isGoogleSubmitting;

  return (
    <AuthShell mode="login">
      <div className="relative">
        {/* Top navigation */}
        <div className="mb-8 flex justify-end">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="ml-1 font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Register
              <ArrowRight className="ml-1 inline-block size-3" />
            </Link>
          </p>
        </div>

        {/* Login heading */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center overflow-hidden rounded-2xl border border-primary/10 bg-white p-2 shadow-sm dark:bg-slate-950">
            <Image
              src="/logo.png"
              alt="UniCore"
              width={56}
              height={56}
              className="size-full object-contain"
              priority
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sign in to continue to your UniCore
            account.
          </p>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-semibold"
            >
              Email Address
            </Label>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="h-12 rounded-xl border-border/70 bg-background pl-10 text-sm shadow-none transition-all focus-visible:ring-2"
                {...register("email")}
              />
            </div>

            {errors.email && (
              <p className="text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-xs font-semibold"
              >
                Password
              </Label>

              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                className="h-12 rounded-xl border-border/70 bg-background pl-10 pr-11 text-sm shadow-none transition-all focus-visible:ring-2"
                {...register("password")}
              />

              <button
                type="button"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                onClick={() =>
                  setShowPassword(
                    (value) => !value,
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-xs font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember me */}
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(
                  event.target.checked,
                )
              }
              className="size-4 cursor-pointer rounded border-border accent-primary"
            />

            <span className="text-xs font-medium text-muted-foreground">
              Remember me
            </span>
          </label>

          {/* Server error */}
          {serverError && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs leading-5 text-destructive"
            >
              {serverError}
            </div>
          )}

          {/* Sign in */}
          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-primary text-sm font-semibold shadow-lg shadow-primary/15 transition-all hover:bg-primary/90"
            disabled={isBusy}
          >
            {isSubmitting ? (
              "Signing In..."
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 size-4" />
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/70" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-[11px] text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          {/* Google login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(response) => {
                if (!response.credential) {
                  setServerError(
                    "Google authentication did not return a valid credential.",
                  );
                  return;
                }

                void handleGoogleLogin(
                  response.credential,
                );
              }}
              onError={() => {
                setServerError(
                  "Google sign-in was cancelled or failed.",
                );
              }}
              text="continue_with"
              shape="rectangular"
              size="large"
              width="400"
              useOneTap={false}
            />
          </div>

          {/* Google loading */}
          {isGoogleSubmitting && (
            <p className="text-center text-xs text-muted-foreground">
              Signing in with Google...
            </p>
          )}

          {/* Register */}
          <p className="pt-2 text-center text-xs text-muted-foreground">
            New to UniCore?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary transition-colors hover:underline"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}