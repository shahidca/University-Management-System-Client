import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  MailCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface AuthShellProps {
  children: ReactNode;
  mode: "login" | "register" | "verify";
}

const content = {
  login: {
    eyebrow: "UNIVERSITY MANAGEMENT SYSTEM",
    title: "Your Academic Journey,",
    highlight: "All in One Place.",
    description:
      "Manage students, courses, attendance, examinations, results, fees, and more — with UniCore.",
    features: [
      {
        icon: Sparkles,
        title: "Smart Management",
        description: "Everything organized in one place",
      },
      {
        icon: BookOpen,
        title: "Better Communication",
        description: "Stay connected with your university",
      },
      {
        icon: GraduationCap,
        title: "Brighter Future",
        description: "Build a stronger academic journey",
      },
    ],
  },

  register: {
    eyebrow: "WELCOME TO UNICORE",
    title: "Join a Community",
    highlight: "of Future Leaders.",
    description:
      "Create your account and take the first step towards a smarter academic future.",
    features: [
      {
        icon: BookOpen,
        title: "Access Courses",
        description: "Explore and enroll in your courses",
      },
      {
        icon: Sparkles,
        title: "Track Progress",
        description: "Monitor your academic journey",
      },
      {
        icon: GraduationCap,
        title: "Build Your Future",
        description: "Get ready for a successful career",
      },
    ],
  },

  verify: {
    eyebrow: "ACCOUNT VERIFICATION",
    title: "Verify Your",
    highlight: "Email Address.",
    description:
      "We've sent a 6-digit verification code to your email. Enter the code to activate your UniCore account.",
    features: [
      {
        icon: MailCheck,
        title: "Check your inbox",
        description: "Look for the verification code",
      },
      {
        icon: ShieldCheck,
        title: "Enter the code",
        description: "Use the 6-digit code we sent",
      },
      {
        icon: CheckCircle2,
        title: "Get started",
        description: "Your account will be activated",
      },
    ],
  },
} as const;

export function AuthShell({
  children,
  mode,
}: AuthShellProps) {
  const current = content[mode];

  return (
    <main className="min-h-screen bg-slate-100/80 px-3 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5 dark:bg-slate-950">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-[1500px] overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl shadow-slate-900/10 sm:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-2.5rem)] lg:rounded-[1.15rem]">
        <div
          className={`grid min-h-full lg:min-h-[calc(100vh-2.5rem)] ${
            mode === "verify"
              ? "lg:grid-cols-[1.18fr_0.82fr]"
              : "lg:grid-cols-[0.92fr_1.08fr]"
          }`}
        >
          <HeroPanel mode={mode} content={current} />

          <section className="relative flex min-h-[calc(100vh-2rem)] items-center justify-center overflow-hidden bg-background px-5 py-12 sm:px-8 lg:min-h-0 lg:px-12 lg:py-10 xl:px-16">
            {/* Soft background decoration */}
            <div className="pointer-events-none absolute -right-32 -top-32 size-72 rounded-full bg-primary/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-blue-500/5 blur-3xl" />

            {/* Mobile branding */}
            <div className="absolute left-5 top-5 flex items-center gap-2.5 lg:hidden">
              <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl border border-primary/10 bg-white p-1.5 shadow-sm dark:bg-slate-950">
                <Image
                  src="/logo.png"
                  alt="UniCore"
                  width={36}
                  height={36}
                  className="size-full object-contain"
                  priority
                />
              </div>

              <div>
                <p className="text-sm font-bold tracking-tight">
                  UniCore
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Learn · Grow · Succeed
                </p>
              </div>
            </div>

            <div className="relative z-10 w-full max-w-[500px]">
              {children}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

interface HeroPanelProps {
  mode: AuthShellProps["mode"];
  content: (typeof content)[AuthShellProps["mode"]];
}

function HeroPanel({
  mode,
  content,
}: HeroPanelProps) {
  return (
    <section className="relative hidden overflow-hidden bg-[#123a82] text-white lg:flex">
      {/* Decorative gradient circles */}
      <div className="absolute -right-28 -top-32 size-[30rem] rounded-full bg-blue-400/20 blur-[2px]" />

      <div className="absolute -bottom-40 -left-40 size-[34rem] rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="absolute left-1/2 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />

      <div className="relative z-10 flex w-full flex-col p-9 xl:p-11">
        {/* Brand */}
        <Link
          href="/"
          className="group flex w-fit items-center gap-3"
        >
          <div className="flex size-12 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-xl shadow-black/10 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="UniCore"
              width={42}
              height={42}
              className="size-full object-contain"
              priority
            />
          </div>

          <div>
            <p className="text-xl font-bold tracking-tight">
              UniCore
            </p>

            <p className="text-[11px] font-medium tracking-wide text-white/65">
              Learn · Grow · Succeed
            </p>
          </div>
        </Link>

        {/* Main content */}
        <div className="mt-auto max-w-[620px] pb-2 xl:pb-4">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/85 backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-cyan-300" />
            {content.eyebrow}
          </div>

          <h1 className="max-w-[580px] text-4xl font-bold leading-[1.08] tracking-tight xl:text-[3.2rem]">
            {content.title}
            <span className="mt-1 block text-cyan-300">
              {content.highlight}
            </span>
          </h1>

          <p className="mt-5 max-w-[500px] text-sm leading-6 text-white/70 xl:text-base">
            {content.description}
          </p>

          {/* Feature list */}
          <div
            className={`mt-8 ${
              mode === "verify"
                ? "grid max-w-[520px] gap-3 sm:grid-cols-3"
                : "space-y-3"
            }`}
          >
            {content.features.map((feature) => (
              <HeroFeature
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                compact={mode !== "verify"}
              />
            ))}
          </div>

          {/* Decorative campus illustration */}
          <CampusIllustration mode={mode} />
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-[10px] text-white/45">
          <span>
            © {new Date().getFullYear()} UniCore. All rights reserved.
          </span>

          <div className="hidden items-center gap-2 sm:flex">
            <span>Learn</span>
            <span>•</span>
            <span>Grow</span>
            <span>•</span>
            <span>Succeed</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroFeature({
  icon: Icon,
  title,
  description,
  compact = false,
}: {
  icon: typeof Sparkles;
  title: string;
  description: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10">
          <Icon className="size-4 text-cyan-200" />
        </div>

        <div>
          <p className="text-xs font-semibold text-white">
            {title}
          </p>

          <p className="mt-0.5 text-[10px] leading-4 text-white/45">
            {description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
      <div className="flex size-9 items-center justify-center rounded-xl bg-white/10">
        <Icon className="size-4 text-cyan-200" />
      </div>

      <p className="mt-3 text-xs font-semibold">
        {title}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-white/45">
        {description}
      </p>
    </div>
  );
}

function CampusIllustration({
  mode,
}: {
  mode: AuthShellProps["mode"];
}) {
  return (
    <div
      className={`relative mt-7 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] ${
        mode === "verify"
          ? "h-44 max-w-[560px]"
          : "h-32 max-w-[500px]"
      }`}
    >
      {/* Sky glow */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-blue-300/10 to-transparent" />

      {/* Sun */}
      <div className="absolute right-12 top-5 size-12 rounded-full bg-cyan-200/20 blur-md" />

      {/* Clouds */}
      <div className="absolute left-10 top-8 h-3 w-20 rounded-full bg-white/10 blur-sm" />
      <div className="absolute left-16 top-6 h-2 w-12 rounded-full bg-white/10 blur-sm" />

      {/* Ground */}
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black/20 to-transparent" />

      {/* Building */}
      <div
        className={`absolute bottom-0 left-1/2 w-[46%] -translate-x-1/2 rounded-t-lg border border-white/10 bg-white/[0.09] ${
          mode === "verify" ? "h-28" : "h-20"
        }`}
      >
        {/* Roof */}
        <div className="absolute -top-5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[4rem] border-b-[1.5rem] border-x-transparent border-b-white/10" />

        {/* Windows */}
        <div className="grid grid-cols-4 gap-2 px-4 pt-5">
          {Array.from({ length: 12 }).map((_, index) => (
            <span
              key={index}
              className="h-2.5 rounded-sm bg-cyan-200/25"
            />
          ))}
        </div>

        {/* Door */}
        <div className="absolute bottom-0 left-1/2 h-8 w-7 -translate-x-1/2 rounded-t bg-blue-950/40" />
      </div>

      {/* Students / people */}
      {mode === "register" && (
        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-end gap-2">
          <Person />
          <Person tall />
          <Person />
          <Person tall />
        </div>
      )}

      {/* Verification envelope */}
      {mode === "verify" && (
        <div className="absolute right-8 top-1/2 flex size-16 -translate-y-1/2 rotate-3 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-xl backdrop-blur-sm">
          <MailCheck className="size-8 text-cyan-200" />
        </div>
      )}

      {/* Login shield */}
      {mode === "login" && (
        <div className="absolute right-8 top-1/2 flex size-16 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-xl backdrop-blur-sm">
          <ShieldCheck className="size-8 text-cyan-200" />
        </div>
      )}
    </div>
  );
}

function Person({
  tall = false,
}: {
  tall?: boolean;
}) {
  return (
    <div
      className={`relative w-5 rounded-t-full bg-white/15 ${
        tall ? "h-16" : "h-12"
      }`}
    >
      <div className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-white/20" />
      <div className="absolute bottom-0 left-1/2 h-1/2 w-1 -translate-x-1/2 bg-cyan-200/20" />
    </div>
  );
}