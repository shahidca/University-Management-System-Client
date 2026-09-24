import { AlertCircle } from "lucide-react";

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
      <div className="mb-4 rounded-full bg-destructive/10 p-3">
        <AlertCircle className="size-6 text-destructive" />
      </div>

      <h2 className="text-lg font-semibold">{title}</h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}