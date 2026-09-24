"use client";

import { useQuery } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/services/api-error";
import { getHealth } from "@/services/health.service";

export default function ApiTestPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
  });

  const errorMessage = error
    ? getApiErrorMessage(error)
    : "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <div className="w-full max-w-xl rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          UniCore API Test
        </h1>

        {isLoading && (
          <p className="mt-4 text-sm text-muted-foreground">
            Connecting to UniCore API...
          </p>
        )}

        {isError && (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <p className="font-medium text-destructive">
              API connection failed
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {errorMessage}
            </p>
          </div>
        )}

        {data && (
          <div className="mt-4">
            <p className="font-medium text-green-600">
              API connection successful
            </p>

            <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        {isFetching && !isLoading && (
          <p className="mt-4 text-xs text-muted-foreground">
            Refreshing API data...
          </p>
        )}
      </div>
    </main>
  );
}