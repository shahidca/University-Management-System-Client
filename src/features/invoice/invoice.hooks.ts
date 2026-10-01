import { useQuery } from "@tanstack/react-query";

import {
  getMyInvoiceById,
  getMyInvoices,
} from "./invoice.service";

import type { InvoiceListQuery } from "./invoice.types";

export const invoiceQueryKeys = {
  all: ["invoices"] as const,

  my: (query?: InvoiceListQuery) =>
    [...invoiceQueryKeys.all, "my", query] as const,

  detail: (id: string) =>
    [...invoiceQueryKeys.all, "detail", id] as const,
};

export function useMyInvoices(
  query?: InvoiceListQuery,
) {
  return useQuery({
    queryKey: invoiceQueryKeys.my(query),
    queryFn: () => getMyInvoices(query),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useMyInvoice(id: string) {
  return useQuery({
    queryKey: invoiceQueryKeys.detail(id),
    queryFn: () => getMyInvoiceById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
    retry: 1,
  });
}