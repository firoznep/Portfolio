"use client";

import { useMemo, useState } from "react";
import { LabCard } from "@/components/LabCard";
import { cn } from "@/lib/utils";
import type { Lab } from "@/lib/types";

interface LabsExplorerProps {
  labs: Lab[];
  categories: string[];
}

export function LabsExplorer({ labs, categories }: LabsExplorerProps) {
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    if (active === "all") return labs;
    return labs.filter((lab) => lab.category === active);
  }, [labs, active]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={cn(
            "rounded-full border px-3.5 py-1.5 font-mono text-sm transition-colors",
            active === "all"
              ? "border-accent-border bg-accent-soft text-accent"
              : "border-border text-text-muted hover:border-border-strong hover:text-text"
          )}
        >
          all ({labs.length})
        </button>
        {categories.map((category) => {
          const count = labs.filter((lab) => lab.category === category).length;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 font-mono text-sm transition-colors",
                active === category
                  ? "border-accent-border bg-accent-soft text-accent"
                  : "border-border text-text-muted hover:border-border-strong hover:text-text"
              )}
            >
              {category.toLowerCase()} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((lab) => (
            <LabCard key={lab.slug} lab={lab} />
          ))}
        </div>
      ) : (
        <p className="mt-8 font-mono text-sm text-text-muted">No labs in this category yet.</p>
      )}
    </div>
  );
}
