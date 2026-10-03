"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  ExternalLink,
  FileText,
  RefreshCw,
  XCircle,
} from "lucide-react";

import { useParams } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useMyPayment } from "@/features/payment/payment.hooks";

import type {
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

function formatDate(
  date: string | null,
) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
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

    case "PENDING":
    case "PROCESSING":
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

function getStatusIcon(
  status: PaymentStatus,
) {
  switch (status) {
    case "SUCCESS":
      return CheckCircle2;

    case "FAILED":
    case "CANCELLED":
      return XCircle;

    default:
      return CreditCard;
  }
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 border-b py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span
        className={`break-all text-sm font-medium sm:text-right ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function PaymentDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>

        <CardContent className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>

        <CardContent className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function StudentPaymentDetailsPage() {
  const params = useParams<{
    id: string;
  }>();

  const paymentId = params.id;

  const {
    data: payment,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyPayment(paymentId);

  if (isLoading) {
    return <PaymentDetailsSkeleton />;
  }

  if (isError || !payment) {
    return (
      <div className="space-y-6">
        <Link
          href="/student/payments"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Payments
        </Link>

        <Alert variant="destructive">
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {error instanceof Error
                ? error.message
                : "Unable to load this payment."}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={
                  isFetching
                    ? "animate-spin"
                    : ""
                }
              />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const StatusIcon =
    getStatusIcon(payment.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Link
            href="/student/payments"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Payments
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Payment Details
            </h1>

            <p className="mt-1 break-all font-mono text-sm text-muted-foreground">
              {payment.transactionId}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={
              isFetching
                ? "animate-spin"
                : ""
            }
          />
          Refresh
        </Button>
      </div>

      {/* Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
                <StatusIcon className="size-6" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Payment Status
                </p>

                <Badge
                  variant={getStatusVariant(
                    payment.status,
                  )}
                  className="mt-1"
                >
                  {getStatusLabel(
                    payment.status,
                  )}
                </Badge>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm text-muted-foreground">
                Amount
              </p>

              <p className="mt-1 text-2xl font-bold">
                {formatCurrency(
                  payment.amount,
                  payment.currency,
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5" />
            Payment Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <DetailRow
            label="Transaction ID"
            value={
              payment.transactionId
            }
            mono
          />

          <DetailRow
            label="Gateway"
            value={payment.gateway}
          />

          <DetailRow
            label="Gateway Transaction ID"
            value={
              payment.gatewayTransactionId ??
              "—"
            }
            mono
          />

          <DetailRow
            label="Amount"
            value={formatCurrency(
              payment.amount,
              payment.currency,
            )}
          />

          <DetailRow
            label="Currency"
            value={payment.currency}
          />

          <DetailRow
            label="Initiated At"
            value={formatDate(
              payment.initiatedAt,
            )}
          />

          <DetailRow
            label="Completed At"
            value={formatDate(
              payment.completedAt,
            )}
          />

          <DetailRow
            label="Failed At"
            value={formatDate(
              payment.failedAt,
            )}
          />

          <DetailRow
            label="Created At"
            value={formatDate(
              payment.createdAt,
            )}
          />
        </CardContent>
      </Card>

      {/* Invoice information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Invoice Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <DetailRow
            label="Invoice Number"
            value={
              payment.invoice
                .invoiceNumber
            }
            mono
          />

          <DetailRow
            label="Invoice Total"
            value={formatCurrency(
              payment.invoice
                .totalAmount,
              payment.currency,
            )}
          />

          <DetailRow
            label="Invoice Due Date"
            value={formatDate(
              payment.invoice.dueDate,
            )}
          />

          <DetailRow
            label="Invoice Status"
            value={
              payment.invoice.status
            }
          />
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-5" />
            Payment Timeline
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <CircleDollarSign className="size-4" />
              </div>

              <div>
                <p className="font-medium">
                  Payment Initiated
                </p>

                <p className="text-sm text-muted-foreground">
                  {formatDate(
                    payment.initiatedAt,
                  )}
                </p>
              </div>
            </div>

            {payment.completedAt && (
              <div className="flex gap-4">
                <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <CheckCircle2 className="size-4" />
                </div>

                <div>
                  <p className="font-medium">
                    Payment Completed
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {formatDate(
                      payment.completedAt,
                    )}
                  </p>
                </div>
              </div>
            )}

            {payment.failedAt && (
              <div className="flex gap-4">
                <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <XCircle className="size-4" />
                </div>

                <div>
                  <p className="font-medium">
                    Payment Failed
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {formatDate(
                      payment.failedAt,
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Failure */}
      {payment.failureReason && (
        <Alert variant="destructive">
          <AlertDescription>
            <span className="font-medium">
              Payment failure reason:
            </span>{" "}
            {payment.failureReason}
          </AlertDescription>
        </Alert>
      )}

      {/* Payment URL */}
      {payment.paymentUrl && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">
                Continue Payment
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Open the payment gateway to
                continue or complete this
                payment.
              </p>
            </div>

            <a
              href={payment.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Open Payment Gateway
              <ExternalLink className="size-4" />
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}