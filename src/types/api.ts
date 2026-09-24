export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

export interface ApiRequestConfig {
  method?: HttpMethod;
  params?: Record<string, unknown>;
  data?: unknown;
}