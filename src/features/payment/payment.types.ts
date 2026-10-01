export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED";

export type PaymentGateway =
  | "SSLCOMMERZ"
  | "STRIPE";

export interface PaymentInvoice {
  id: string;
  invoiceNumber: string;
  totalAmount: number | string;
  dueDate: string;
  status: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  transactionId: string;
  gatewayTransactionId: string | null;
  gateway: PaymentGateway;
  amount: number | string;
  currency: string;
  status: PaymentStatus;
  paymentUrl: string | null;
  failureReason: string | null;
  initiatedAt: string;
  completedAt: string | null;
  failedAt: string | null;
  createdAt: string;
  updatedAt: string;
  invoice: PaymentInvoice;
}

export interface PaymentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaymentListResponse {
  payments: Payment[];
  pagination: PaymentPagination;
}

export interface PaymentListQuery {
  page?: number;
  limit?: number;
  invoiceId?: string;
  status?: PaymentStatus;
  gateway?: PaymentGateway;
  transactionId?: string;
  search?: string;
  sortBy?:
    | "createdAt"
    | "amount"
    | "status"
    | "completedAt";
  sortOrder?: "asc" | "desc";
}