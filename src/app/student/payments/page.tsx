"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  RefreshCw,
  ReceiptText,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { useMyPayments } from "@/features/payment/payment.hooks";

import type {
  Payment,
  PaymentStatus,
} from "@/features/payment/payment.types";

function formatCurrency(
  amount: number | string,
  currency: string,
) {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return `${amount} ${currency}`;
  }

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(numericAmount);
}

function formatDate(date: string | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function getStatusVariant(
  status: PaymentStatus,
) {
  switch (status) {
    case "SUCCESS":
      return "default" as const;

    case "FAILED":
    case "CANCELLED":
      return "destructive" as const;

    case "PROCESSING":
    case "PENDING":
      return "secondary" as const;

    default:
      return "outline" as const;
  }
}

function getStatusLabel(
  status: PaymentStatus,
) {
  return (
    status.charAt(0) +
    status.slice(1).toLowerCase()
  );
}

function PaymentCard({
  payment,
}: {
  payment: Payment;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={getStatusVariant(
                  payment.status,
                )}
              >
                {getStatusLabel(
                  payment.status,
                )}
              </Badge>

              <Badge variant="outline">
                {payment.gateway}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Transaction ID
              </p>

              <p className="mt-1 break-all font-mono text-sm font-medium">
                {payment.transactionId}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ReceiptText className="size-4" />
                {payment.invoice.invoiceNumber}
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4" />
                {formatDate(
                  payment.createdAt,
                )}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
            <div>
              <p className="text-xs text-muted-foreground">
                Amount Paid
              </p>

              <p className="mt-1 text-xl font-semibold">
                {formatCurrency(
                  payment.amount,
                  payment.currency,
                )}
              </p>
            </div>

            <Link
              href={`/student/payments/${payment.id}`}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              View Details
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {payment.failureReason && (
          <div className="border-t bg-destructive/5 px-5 py-3 text-sm text-destructive">
            <span className="font-medium">
              Failure reason:
            </span>{" "}
            {payment.failureReason}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PaymentCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-56" />
          </div>

          <Skeleton className="h-8 w-24" />
        </div>

        <div className="flex gap-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentPaymentsPage() {
  const [search, setSearch] =
    useState("");

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyPayments({
    page: 1,
    limit: 50,
    search:
      search.trim() || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const payments =
    data?.payments ?? [];

  const summary = useMemo(() => {
    const successful =
      payments.filter(
        (payment) =>
          payment.status ===
          "SUCCESS",
      );

    const pending =
      payments.filter(
        (payment) =>
          payment.status ===
            "PENDING" ||
          payment.status ===
            "PROCESSING",
      );

    const failed =
      payments.filter(
        (payment) =>
          payment.status ===
            "FAILED" ||
          payment.status ===
            "CANCELLED",
      );

    const totalPaid =
      successful.reduce(
        (total, payment) =>
          total +
          Number(payment.amount),
        0,
      );

    return {
      total: payments.length,
      successful:
        successful.length,
      pending: pending.length,
      failed: failed.length,
      totalPaid,
    };
  }, [payments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Payments
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View your payment history
            and transaction details.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`size-4 ${
              isFetching
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payments
            </CardTitle>

            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">
                {summary.total}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Successful
            </CardTitle>

            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">
                {summary.successful}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending
            </CardTitle>

            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">
                {summary.pending}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Paid
            </CardTitle>

            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <p className="text-2xl font-bold">
                ৳
                {summary.totalPaid.toLocaleString(
                  "en-BD",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search by transaction ID, gateway transaction ID, or invoice number..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {isError && (
        <Alert variant="destructive">
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {error instanceof Error
                ? error.message
                : "Unable to load your payments."}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading */}
      {!isError &&
        isLoading && (
          <div className="space-y-4">
            <PaymentCardSkeleton />
            <PaymentCardSkeleton />
            <PaymentCardSkeleton />
          </div>
        )}

      {/* Empty */}
      {!isError &&
        !isLoading &&
        payments.length === 0 && (
          <Card>
            <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <CreditCard className="size-6 text-muted-foreground" />
              </div>

              <h2 className="text-lg font-semibold">
                No payments found
              </h2>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {search
                  ? "No payments match your search."
                  : "Your payment history will appear here once you make a payment."}
              </p>
            </CardContent>
          </Card>
        )}

      {/* Payment list */}
      {!isError &&
        !isLoading &&
        payments.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Payment History
                </h2>

                <p className="text-sm text-muted-foreground">
                  {payments.length} payment
                  {payments.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>

              {summary.failed >
                0 && (
                <Badge variant="destructive">
                  {summary.failed} failed
                </Badge>
              )}
            </div>

            {payments.map(
              (payment) => (
                <PaymentCard
                  key={payment.id}
                  payment={payment}
                />
              ),
            )}
          </div>
        )}
    </div>
  );
}