import { apiRequest } from "@/services";

import type {
  Payment,
  PaymentListQuery,
  PaymentListResponse,
} from "./payment.types";

export function getMyPayments(
  query?: PaymentListQuery,
): Promise<PaymentListResponse> {
  return apiRequest<PaymentListResponse>({
    method: "GET",
    url: "/payments/my",
    params: query,
  });
}

export function getMyPaymentById(
  id: string,
): Promise<Payment> {
  return apiRequest<Payment>({
    method: "GET",
    url: `/payments/my/${id}`,
  });
}