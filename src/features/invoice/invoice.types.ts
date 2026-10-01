export type InvoiceStatus =
  | "PENDING"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

export interface InvoiceFee {
  id: string;
  name: string;
  code: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  feeId: string;
  description: string;
  quantity: number;
  unitAmount: number | string;
  totalAmount: number | string;
  createdAt: string;
  updatedAt: string;
  fee: InvoiceFee;
}

export interface InvoiceStudentUser {
  id: string;
  email: string;
}

export interface InvoiceStudent {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  user: InvoiceStudentUser;
}

export interface Invoice {
  id: string;
  studentId: string;
  invoiceNumber: string;

  subtotal: number | string;
  discount: number | string;
  totalAmount: number | string;

  dueDate: string;
  status: InvoiceStatus;
  description: string | null;

  issuedAt: string | null;
  paidAt: string | null;

  createdAt: string;
  updatedAt: string;

  student: InvoiceStudent;
  items: InvoiceItem[];
}

export interface InvoicePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  pagination: InvoicePagination;
}

export interface InvoiceListQuery {
  page?: number;
  limit?: number;
  studentId?: string;
  status?: InvoiceStatus;
  search?: string;
  sortBy?:
    | "createdAt"
    | "dueDate"
    | "totalAmount"
    | "status";
  sortOrder?: "asc" | "desc";
}