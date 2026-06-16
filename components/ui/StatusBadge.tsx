import { cn } from "@/lib/utils";

type Status = "completed" | "in-progress" | "planned";

const STATUS_STYLES: Record<
  Status,
  { dot: string; text: string; bg: string; border: string; defaultLabel: string }
> = {
  completed: {
    dot: "bg-green",
    text: "text-green",
    bg: "bg-green-soft",
    border: "border-green/30",
    defaultLabel: "Completed",
  },
  "in-progress": {
    dot: "bg-amber",
    text: "text-amber",
    bg: "bg-amber-soft",
    border: "border-amber/30",
    defaultLabel: "In progress",
  },
  planned: {
    dot: "bg-text-dim",
    text: "text-text-muted",
    bg: "bg-surface",
    border: "border-border-strong",
    defaultLabel: "Planned",
  },
};

interface StatusBadgeProps {
  status: Status;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs",
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot, status === "in-progress" && "animate-pulse")} />
      {label ?? styles.defaultLabel}
    </span>
  );
}
