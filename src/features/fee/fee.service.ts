import { apiRequest } from "@/services";

import type {
  InvoiceListResponse,
  StudentInvoice,
} from "./fee.types";

export interface InvoiceListQuery {
  page?: number;
  limit?: number;
  status?: StudentInvoice["status"];
  search?: string;
  sortBy?:
    | "createdAt"
    | "dueDate"
    | "totalAmount"
    | "status";
  sortOrder?: "asc" | "desc";
}

export function getMyInvoices(
  query?: InvoiceListQuery,
): Promise<InvoiceListResponse> {
  return apiRequest<InvoiceListResponse>({
    method: "GET",
    url: "/invoices",
    params: query,
  });
}

export function getInvoiceById(
  id: string,
): Promise<StudentInvoice> {
  return apiRequest<StudentInvoice>({
    method: "GET",
    url: `/invoices/${id}`,
  });
}