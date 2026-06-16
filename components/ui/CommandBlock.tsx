"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandBlockProps {
  commands: string[];
  className?: string;
}

/** A `$ command` block with a copy-to-clipboard button. */
export function CommandBlock({ commands, className }: CommandBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = commands.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — silently ignore.
    }
  }

  return (
    <div
      className={cn(
        "group relative overflow-x-auto rounded-lg border border-border bg-bg-soft",
        className
      )}
    >
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy commands"
        className="absolute right-2 top-2 z-10 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs text-text-muted opacity-0 transition-opacity hover:border-accent-border hover:text-text group-hover:opacity-100 focus-visible:opacity-100"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" /> Copy
          </>
        )}
      </button>
      <pre className="px-4 py-3 font-mono text-[13px] leading-relaxed text-text sm:text-sm">
        {commands.map((cmd, i) => (
          <div key={i}>
            <span className="select-none text-accent">$ </span>
            <span className="text-text">{cmd}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}
