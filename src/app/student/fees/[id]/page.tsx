"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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

import { useMyInvoice } from "@/features/invoice/invoice.hooks";

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
      return "secondary";

    case "OVERDUE":
    case "CANCELLED":
      return "destructive";

    default:
      return "outline";
  }
}

function InvoiceDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-36" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-5 w-72 max-w-full" />
        </div>

        <Skeleton className="h-10 w-28" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-3 p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>

        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>

              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StudentInvoiceDetailPage() {
  const params = useParams<{ id: string }>();

  const invoiceId =
    typeof params.id === "string"
      ? params.id
      : "";

  const {
    data: invoice,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyInvoice(invoiceId);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <InvoiceDetailSkeleton />
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/student/fees"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Fees
          </Link>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="size-4" />

          <AlertTitle>
            Unable to load invoice
          </AlertTitle>

          <AlertDescription className="mt-2 flex flex-col gap-4">
            <span>
              {error instanceof Error
                ? error.message
                : "We could not load this invoice. Please try again."}
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

  const subtotal = Number(invoice.subtotal);
  const discount = Number(invoice.discount);
  const totalAmount = Number(invoice.totalAmount);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/student/fees"
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Fees & Invoices
        </Link>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {invoice.invoiceNumber}
                </h1>

                <Badge
                  variant={getStatusVariant(invoice.status)}
                >
                  {getStatusLabel(invoice.status)}
                </Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {invoice.description ??
                  "University fee invoice"}
              </p>
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
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total Amount
              </p>

              <WalletCards className="size-5 text-primary" />
            </div>

            <p className="text-2xl font-bold">
              {formatAmount(totalAmount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Due Date
              </p>

              <CalendarDays className="size-5 text-primary" />
            </div>

            <p className="text-base font-semibold">
              {formatDate(invoice.dueDate)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Issued
              </p>

              <FileText className="size-5 text-primary" />
            </div>

            <p className="text-base font-semibold">
              {formatDate(invoice.issuedAt)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Payment Status
              </p>

              {invoice.status === "PAID" ? (
                <CheckCircle2 className="size-5 text-primary" />
              ) : (
                <Clock3 className="size-5 text-muted-foreground" />
              )}
            </div>

            <Badge
              variant={getStatusVariant(invoice.status)}
            >
              {getStatusLabel(invoice.status)}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Invoice Items */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>

          <CardContent>
            {invoice.items.length === 0 ? (
              <div className="rounded-xl border border-dashed px-6 py-10 text-center">
                <FileText className="mx-auto size-8 text-muted-foreground" />

                <p className="mt-3 text-sm text-muted-foreground">
                  No invoice items are available.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {invoice.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">
                        {item.description}
                      </p>

                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>
                          Fee: {item.fee.name}
                        </span>

                        <span>
                          Code: {item.fee.code}
                        </span>

                        <span>
                          Quantity: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 sm:text-right">
                      <p className="text-xs text-muted-foreground">
                        Amount
                      </p>

                      <p className="font-semibold">
                        {formatAmount(item.totalAmount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal
              </span>

              <span className="font-medium">
                {formatAmount(subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Discount
              </span>

              <span className="font-medium">
                {formatAmount(discount)}
              </span>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  Total
                </span>

                <span className="text-xl font-bold">
                  {formatAmount(totalAmount)}
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-sm font-medium">
                    Payment Due
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">
                Student ID
              </p>

              <p className="mt-1 font-medium">
                {invoice.student.studentId}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Name
              </p>

              <p className="mt-1 font-medium">
                {invoice.student.firstName}{" "}
                {invoice.student.lastName}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Email
              </p>

              <p className="mt-1 break-all font-medium">
                {invoice.student.user.email}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Invoice Number
              </p>

              <p className="mt-1 font-medium">
                {invoice.invoiceNumber}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}