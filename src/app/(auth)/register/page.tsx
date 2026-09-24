"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getApiErrorMessage } from "@/services";

import {
  googleLogin,
  register as registerUser,
} from "@/features/auth/auth.service";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/auth.validation";

export default function RegisterPage() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError("");

    try {
      const response = await registerUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      const params = new URLSearchParams({
        email: response.email,
      });

      router.push(`/verify-email?${params.toString()}`);
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    }
  };

  const handleGoogleRegister = async (
    credential: string,
  ) => {
    setServerError("");
    setIsGoogleSubmitting(true);

    try {
      await googleLogin({
        idToken: credential,
      });

      router.push("/");
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const isSubmittingAny =
    isSubmitting || isGoogleSubmitting;

  return (
    <AuthShell mode="register">
      {/* Header */}
      <div className="mb-7">
        <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary lg:hidden">
          <User className="size-5" />
        </div>

        <p className="text-sm font-medium text-primary">
          Get started
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          Create Your Account
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Fill in your details to get started with your
          UniCore academic journey.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* First name + Last name */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="firstName"
            label="First name"
            placeholder="John"
            autoComplete="given-name"
            icon={<User className="size-4" />}
            error={errors.firstName?.message}
            registration={register("firstName")}
          />

          <FormField
            id="lastName"
            label="Last name"
            placeholder="Doe"
            autoComplete="family-name"
            icon={<User className="size-4" />}
            error={errors.lastName?.message}
            registration={register("lastName")}
          />
        </div>

        {/* Email */}
        <FormField
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          icon={<Mail className="size-4" />}
          error={errors.email?.message}
          registration={register("email")}
        />

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">
            Password
          </Label>

          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="password"
              type={
                showPassword ? "text" : "password"
              }
              placeholder="Create a strong password"
              autoComplete="new-password"
              className="h-12 pl-10 pr-11"
              {...register("password")}
            />

            <PasswordToggle
              visible={showPassword}
              onClick={() =>
                setShowPassword((value) => !value)
              }
            />
          </div>

          {errors.password && (
            <p className="text-xs font-medium text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Confirm password
          </Label>

          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm your password"
              autoComplete="new-password"
              className="h-12 pl-10 pr-11"
              {...register("confirmPassword")}
            />

            <PasswordToggle
              visible={showConfirmPassword}
              onClick={() =>
                setShowConfirmPassword((value) => !value)
              }
            />
          </div>

          {errors.confirmPassword && (
            <p className="text-xs font-medium text-destructive">
              {errors.confirmPassword.message}
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

        {/* Create account */}
        <Button
          type="submit"
          className="mt-2 h-12 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/10"
          disabled={isSubmittingAny}
        >
          {isSubmitting ? (
            "Creating account..."
          ) : (
            <>
              Create account
              <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs text-muted-foreground">
              Or sign up with
            </span>
          </div>
        </div>

        {/* Google */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(response) => {
              if (!response.credential) {
                setServerError(
                  "Google authentication did not return a valid credential.",
                );
                return;
              }

              void handleGoogleRegister(
                response.credential,
              );
            }}
            onError={() => {
              setServerError(
                "Google sign-up was cancelled or failed.",
              );
            }}
            text="signup_with"
            shape="rectangular"
            size="large"
            width="400"
            useOneTap={false}
          />
        </div>

        {/* Google loading */}
        {isGoogleSubmitting && (
          <p className="text-center text-xs text-muted-foreground">
            Creating your account with Google...
          </p>
        )}

        {/* Login */}
        <p className="pt-2 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
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

function FormField({
  id,
  label,
  placeholder,
  type = "text",
  autoComplete,
  icon,
  error,
  registration,
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  icon: React.ReactNode;
  error?: string;
  registration: ReturnType<
    typeof import("react-hook-form").useForm<RegisterFormValues>
  >["register"] extends (...args: never[]) => infer R
    ? R
    : never;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>

        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-12 pl-10"
          {...registration}
        />
      </div>

      {error && (
        <p className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordToggle({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={
        visible ? "Hide password" : "Show password"
      }
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
    >
      {visible ? (
        <EyeOff className="size-4" />
      ) : (
        <Eye className="size-4" />
      )}
    </button>
  );
}