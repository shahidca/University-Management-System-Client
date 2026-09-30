import { useQuery } from "@tanstack/react-query";

import {
  getInvoiceById,
  getMyInvoices,
} from "./fee.service";

import type { InvoiceListQuery } from "./fee.service";

export const feeQueryKeys = {
  all: ["fees"] as const,

  invoices: (query?: InvoiceListQuery) =>
    [...feeQueryKeys.all, "invoices", query] as const,

  invoice: (id: string) =>
    [...feeQueryKeys.all, "invoice", id] as const,
};

export function useMyInvoices(
  query?: InvoiceListQuery,
) {
  return useQuery({
    queryKey: feeQueryKeys.invoices(query),
    queryFn: () => getMyInvoices(query),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: feeQueryKeys.invoice(id),
    queryFn: () => getInvoiceById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
    retry: 1,
  });
}