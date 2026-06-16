import { Server, Network, Boxes, Code2, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { skillGroups } from "@/lib/content";

const GROUP_ICONS: Record<string, LucideIcon> = {
  rhel: Server,
  networking: Network,
  systems: Boxes,
  dev: Code2,
};

export function Skills() {
  const featured = skillGroups.find((g) => g.featured);
  const others = skillGroups.filter((g) => !g.featured);

  return (
    <section id="skills" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal>
          <SectionHeading
            path="~/skills.json"
            title="Skills"
            description="Grouped the way I'd actually reach for them — Linux and Red Hat tooling first, since that's the direction I'm building toward."
          />
        </Reveal>

        {featured && (
          <Reveal delay={100} className="mt-10">
            <div className="rounded-2xl border border-accent-border bg-accent-soft/40 p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-text">
                  <Server className="h-5 w-5 text-accent" aria-hidden />
                  {featured.title}
                </h3>
                <span className="font-mono text-xs text-accent">{featured.tagline}</span>
              </div>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {featured.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-start gap-2 rounded-lg border border-border bg-bg-soft px-3 py-2.5 font-mono text-sm text-text"
                  >
                    <span className="text-accent">›</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((group, i) => {
            const Icon = GROUP_ICONS[group.id] ?? Code2;
            return (
              <Reveal key={group.id} delay={160 + i * 80}>
                <div
                  className={cn(
                    "h-full rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-strong"
                  )}
                >
                  <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-text">
                    <Icon className="h-4.5 w-4.5 text-text-muted" aria-hidden />
                    {group.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-text-dim">{group.tagline}</p>

                  <ul className="mt-4 space-y-2">
                    {group.skills.map((skill) => (
                      <li key={skill} className="flex items-start gap-2 text-sm text-text-muted">
                        <span className="mt-1 text-accent">›</span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
