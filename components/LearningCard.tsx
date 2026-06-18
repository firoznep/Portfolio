import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { LearningEntry } from "@/lib/types";

function formatDate(value: string) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function LearningCard({ entry }: { entry: LearningEntry }) {
  return (
    <Link
      href={`/learning/${entry.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent-border hover:bg-surface-hover"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-wide text-text-dim">
          {entry.category}
        </span>
        <StatusBadge status={entry.status} />
      </div>

      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-text">
        {entry.title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{entry.summary}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {entry.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-border bg-bg-soft px-2 py-1 font-mono text-xs text-text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 font-mono text-xs text-text-dim">
        <span>{formatDate(entry.date)}</span>
        <span className="inline-flex items-center gap-1 text-text-muted transition-colors group-hover:text-accent">
          Read note
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
