import { Inbox } from "lucide-react";

export function EmptyState({
  title = "No data found",
  description = "There is nothing to display here yet.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <Inbox className="size-6 text-muted-foreground" />
      </div>

      <h2 className="text-lg font-semibold">{title}</h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}