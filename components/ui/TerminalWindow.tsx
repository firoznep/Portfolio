import { cn } from "@/lib/utils";

interface TerminalWindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * Shared terminal-window chrome — traffic-light dots in the brand palette
 * and a title bar. Used for the hero "boot sequence" and for command
 * blocks throughout the labs section.
 */
export function TerminalWindow({
  title = "firoz@rhel:~",
  children,
  className,
  contentClassName,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border-strong bg-bg-soft shadow-2xl shadow-black/40",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-amber" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-green" aria-hidden />
        <span className="ml-2 truncate font-mono text-xs text-text-dim">{title}</span>
      </div>
      <div className={cn("p-5 font-mono text-sm leading-relaxed sm:p-6", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
