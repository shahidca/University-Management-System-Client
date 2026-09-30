export type InvoiceStatus =
  | "DRAFT"
  | "ISSUED"
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

export interface InvoiceStudent {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  user: {
    id: string;
    email: string;
  };
}

export interface StudentInvoice {
  id: string;
  studentId: string;
  invoiceNumber: string;
  subtotal: number | string;
  discount: number | string;
  totalAmount: number | string;
  dueDate: string | null;
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
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface InvoiceListResponse {
  invoices: StudentInvoice[];
  pagination: InvoicePagination;
}