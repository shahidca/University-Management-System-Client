import { apiRequest } from "@/services";

import type {
  Invoice,
  InvoiceListQuery,
  InvoiceListResponse,
} from "./invoice.types";

export function getMyInvoices(
  query?: InvoiceListQuery,
): Promise<InvoiceListResponse> {
  return apiRequest<InvoiceListResponse>({
    method: "GET",
    url: "/invoices/my",
    params: query,
  });
}

export function getMyInvoiceById(
  id: string,
): Promise<Invoice> {
  return apiRequest<Invoice>({
    method: "GET",
    url: `/invoices/my/${id}`,
  });
}