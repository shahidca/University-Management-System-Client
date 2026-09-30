"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  RefreshCw,
  WalletCards,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useMyInvoices } from "@/features/fee/fee.hooks";

function formatAmount(value: number | string) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return String(value);
  }

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
}

function getStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "PAID":
      return "default";

    case "PARTIALLY_PAID":
    case "ISSUED":
      return "secondary";

    case "OVERDUE":
    case "CANCELLED":
      return "destructive";

    default:
      return "outline";
  }
}

function FeesPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-3 p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>

        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border p-5"
            >
              <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StudentFeesPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyInvoices({
    page: 1,
    limit: 50,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <FeesPageSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/student"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="size-4" />

          <AlertTitle>
            Unable to load fee information
          </AlertTitle>

          <AlertDescription className="mt-2 flex flex-col gap-4">
            <span>
              {error instanceof Error
                ? error.message
                : "We could not load your invoices. Please try again."}
            </span>

            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`size-4 ${
                  isFetching ? "animate-spin" : ""
                }`}
              />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const invoices = data.invoices;

  const totalInvoices = invoices.length;

  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === "PAID",
  ).length;

  const outstandingAmount = invoices
    .filter(
      (invoice) =>
        invoice.status !== "PAID" &&
        invoice.status !== "CANCELLED",
    )
    .reduce(
      (total, invoice) =>
        total + Number(invoice.totalAmount),
      0,
    );

  const totalBilledAmount = invoices.reduce(
    (total, invoice) =>
      total + Number(invoice.totalAmount),
    0,
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/student"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <WalletCards className="size-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Fees & Invoices
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                View your university fees, invoices, and payment status.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`size-4 ${
              isFetching ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total Invoices
              </p>

              <FileText className="size-5 text-primary" />
            </div>

            <p className="text-3xl font-bold">
              {totalInvoices}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Paid Invoices
              </p>

              <CheckCircle2 className="size-5 text-primary" />
            </div>

            <p className="text-3xl font-bold">
              {paidInvoices}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Outstanding
              </p>

              <Clock3 className="size-5 text-primary" />
            </div>

            <p className="text-2xl font-bold">
              {formatAmount(outstandingAmount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total Billed
              </p>

              <WalletCards className="size-5 text-primary" />
            </div>

            <p className="text-2xl font-bold">
              {formatAmount(totalBilledAmount)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle>My Invoices</CardTitle>
        </CardHeader>

        <CardContent>
          {invoices.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <FileText className="size-5 text-muted-foreground" />
              </div>

              <h3 className="text-lg font-semibold">
                No invoices found
              </h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                You currently do not have any invoices available in
                your student account.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="rounded-xl border p-4 transition-colors hover:bg-muted/30 sm:p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          {invoice.invoiceNumber}
                        </h3>

                        <Badge
                          variant={getStatusVariant(
                            invoice.status,
                          )}
                        >
                          {getStatusLabel(invoice.status)}
                        </Badge>
                      </div>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {invoice.description ??
                          "University fee invoice"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="size-4" />
                          Due: {formatDate(invoice.dueDate)}
                        </span>

                        <span>
                          Issued: {formatDate(invoice.issuedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
                      <div className="sm:text-right">
                        <p className="text-xs text-muted-foreground">
                          Total Amount
                        </p>

                        <p className="text-xl font-bold">
                          {formatAmount(
                            invoice.totalAmount,
                          )}
                        </p>
                      </div>

                      <Link
                        href={`/student/fees/${invoice.id}`}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <FileText className="size-4" />
                        View Invoice
                      </Link>
                    </div>
                  </div>

                  {invoice.items.length > 0 && (
                    <div className="mt-5 border-t pt-4">
                      <p className="mb-3 text-sm font-medium">
                        Invoice Items
                      </p>

                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {invoice.items.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="rounded-lg bg-muted/50 px-3 py-2"
                          >
                            <p className="truncate text-sm font-medium">
                              {item.description}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatAmount(item.totalAmount)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {invoice.items.length > 3 && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          +{invoice.items.length - 3} more item
                          {invoice.items.length - 3 === 1
                            ? ""
                            : "s"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}