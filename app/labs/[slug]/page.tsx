import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Code2, Cpu, ExternalLink, NotebookText, Target } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { Reveal } from "@/components/ui/Reveal";
import { getAllLabSlugs, getAllLabs, getLabBySlug } from "@/lib/content";

interface LabPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllLabSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: LabPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lab = getLabBySlug(slug);

  if (!lab) {
    return { title: "Lab not found" };
  }

  return {
    title: lab.title,
    description: lab.summary,
  };
}

function formatDate(value: string) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default async function LabPage({ params }: LabPageProps) {
  const { slug } = await params;
  const lab = getLabBySlug(slug);

  if (!lab) {
    notFound();
  }

  const allLabs = getAllLabs();
  const currentIndex = allLabs.findIndex((l) => l.slug === lab.slug);
  const previous = allLabs[currentIndex + 1];
  const next = allLabs[currentIndex - 1];

  return (
    <div className="bg-grid">
      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <Link
          href="/labs"
          className="inline-flex items-center gap-1.5 font-mono text-sm text-text-muted hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          all labs
        </Link>

        <Reveal className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wide text-text-dim">
              {lab.category}
            </span>
            <StatusBadge status={lab.status} />
            <span className="font-mono text-xs text-text-dim">{formatDate(lab.date)}</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-text sm:text-4xl">
            {lab.title}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">{lab.summary}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {lab.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          {lab.links && (lab.links.live || lab.links.github || lab.links.notes) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {lab.links.live && (
                <Link
                  href={lab.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-accent-border bg-accent-soft px-3.5 py-2 font-mono text-sm text-accent transition-colors hover:border-accent hover:bg-surface"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  live app
                </Link>
              )}
              {lab.links.github && (
                <Link
                  href={lab.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 font-mono text-sm text-text-muted transition-colors hover:border-border-strong hover:text-text"
                >
                  <Code2 className="h-4 w-4" aria-hidden />
                  source
                </Link>
              )}
              {lab.links.notes && (
                <Link
                  href={lab.links.notes}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 font-mono text-sm text-text-muted transition-colors hover:border-border-strong hover:text-text"
                >
                  <NotebookText className="h-4 w-4" aria-hidden />
                  notes
                </Link>
              )}
            </div>
          )}
        </Reveal>

        <Reveal delay={60} className="mt-10 rounded-2xl border border-border bg-surface p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text">
            <Cpu className="h-4.5 w-4.5 text-accent" aria-hidden />
            Environment
          </h2>
          <ul className="mt-3 space-y-1.5">
            {lab.environment.map((item) => (
              <li key={item} className="flex gap-2 font-mono text-sm text-text-muted">
                <span className="text-accent">›</span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100} className="mt-8">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text">
            <Target className="h-4.5 w-4.5 text-accent" aria-hidden />
            Objectives
          </h2>
          <ol className="mt-3 space-y-2">
            {lab.objectives.map((objective, i) => (
              <li key={objective} className="flex gap-3 text-sm leading-relaxed text-text-muted">
                <span className="shrink-0 font-mono text-text-dim">{String(i + 1).padStart(2, "0")}</span>
                <span>{objective}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="mt-10 space-y-8">
          <h2 className="font-display text-lg font-semibold text-text">Walkthrough</h2>
          {lab.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 60}>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <p className="font-mono text-xs text-text-dim">Step {i + 1}</p>
                <h3 className="mt-1 font-display text-base font-semibold text-text">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{step.description}</p>
                {step.commands && step.commands.length > 0 && (
                  <CommandBlock commands={step.commands} className="mt-4" />
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={80} className="mt-10 rounded-2xl border border-green/20 bg-green-soft/20 p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text">
            <CheckCircle2 className="h-4.5 w-4.5 text-green" aria-hidden />
            Outcomes
          </h2>
          <ul className="mt-3 space-y-2">
            {lab.outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-2 text-sm leading-relaxed text-text-muted">
                <span className="mt-0.5 text-green">✓</span>
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {(previous || next) && (
          <nav className="mt-14 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            {previous ? (
              <Link
                href={`/labs/${previous.slug}`}
                className="group flex flex-col rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent-border sm:max-w-xs"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-text-dim">
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                  previous
                </span>
                <span className="mt-1 truncate text-sm text-text group-hover:text-accent">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/labs/${next.slug}`}
                className="group flex flex-col rounded-lg border border-border bg-surface p-4 text-right transition-colors hover:border-accent-border sm:max-w-xs"
              >
                <span className="inline-flex items-center justify-end gap-1.5 font-mono text-xs text-text-dim">
                  next
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="mt-1 truncate text-sm text-text group-hover:text-accent">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </article>
    </div>
  );
}
