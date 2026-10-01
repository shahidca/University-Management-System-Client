import { useQuery } from "@tanstack/react-query";

import {
  getMyPaymentById,
  getMyPayments,
} from "./payment.service";

import type { PaymentListQuery } from "./payment.types";

export const paymentQueryKeys = {
  all: ["payments"] as const,

  my: (query?: PaymentListQuery) =>
    [...paymentQueryKeys.all, "my", query] as const,

  detail: (id: string) =>
    [...paymentQueryKeys.all, "detail", id] as const,
};

export function useMyPayments(
  query?: PaymentListQuery,
) {
  return useQuery({
    queryKey: paymentQueryKeys.my(query),
    queryFn: () => getMyPayments(query),
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useMyPayment(id: string) {
  return useQuery({
    queryKey: paymentQueryKeys.detail(id),
    queryFn: () => getMyPaymentById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
    retry: 1,
  });
}