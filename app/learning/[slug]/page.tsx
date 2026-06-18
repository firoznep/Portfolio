import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, Lightbulb, Target } from "lucide-react";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { Reveal } from "@/components/ui/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  getAllLearning,
  getAllLearningSlugs,
  getLearningBySlug,
} from "@/lib/content";

interface LearningPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllLearningSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: LearningPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getLearningBySlug(slug);

  if (!entry) {
    return { title: "Learning note not found" };
  }

  return {
    title: entry.title,
    description: entry.summary,
  };
}

function formatDate(value: string) {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function LearningScreenshot({
  title,
  lines,
  image,
}: {
  title: string;
  lines?: string[];
  image?: {
    src?: string;
    alt: string;
    placeholder?: string;
  };
}) {
  const hasImage = Boolean(image?.src);

  return (
    <figure className="mt-4 overflow-hidden rounded-lg border border-border bg-bg-soft">
      <figcaption className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2 font-mono text-xs text-text-dim">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-amber" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-green" aria-hidden />
        <span className="ml-2">{title}</span>
      </figcaption>
      {hasImage ? (
        <div className="relative aspect-video w-full bg-black">
          <Image
            src={image?.src ?? ""}
            alt={image?.alt ?? ""}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-contain"
          />
        </div>
      ) : image ? (
        <div className="flex min-h-56 items-center justify-center border border-dashed border-border-strong bg-surface/40 p-6 text-center">
          <div>
            <p className="font-mono text-sm text-text">Screenshot placeholder</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-text-muted">
              {image.placeholder ??
                "Add a screenshot image path in this note when the VM capture is ready."}
            </p>
          </div>
        </div>
      ) : lines && lines.length > 0 ? (
        <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-relaxed text-text sm:text-sm">
          {lines.map((line, index) => (
            <div
              key={`${line}-${index}`}
              className={line.startsWith("$") ? "text-accent" : "text-text-muted"}
            >
              {line}
            </div>
          ))}
        </pre>
      ) : null}
    </figure>
  );
}


export default async function LearningNotePage({ params }: LearningPageProps) {
  const { slug } = await params;
  const entry = getLearningBySlug(slug);

  if (!entry) {
    notFound();
  }

  const allEntries = getAllLearning();
  const currentIndex = allEntries.findIndex((item) => item.slug === entry.slug);
  const previous = allEntries[currentIndex + 1];
  const next = allEntries[currentIndex - 1];

  return (
    <div className="bg-grid">
      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <Link
          href="/learning"
          className="inline-flex items-center gap-1.5 font-mono text-sm text-text-muted hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          all notes
        </Link>

        <Reveal className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wide text-text-dim">
              {entry.category}
            </span>
            <StatusBadge status={entry.status} />
            <span className="font-mono text-xs text-text-dim">{formatDate(entry.date)}</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-text sm:text-4xl">
            {entry.title}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
            {entry.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={60} className="mt-10 rounded-2xl border border-border bg-surface p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text">
            <Target className="h-4.5 w-4.5 text-accent" aria-hidden />
            Purpose
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">{entry.purpose}</p>
        </Reveal>

        <Reveal delay={100} className="mt-8">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text">
            <Lightbulb className="h-4.5 w-4.5 text-accent" aria-hidden />
            Key points
          </h2>
          <ul className="mt-3 space-y-2">
            {entry.keyPoints.map((point) => (
              <li key={point} className="flex gap-2 text-sm leading-relaxed text-text-muted">
                <span className="mt-0.5 text-accent">›</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-10 space-y-8">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text">
            <BookOpen className="h-4.5 w-4.5 text-accent" aria-hidden />
            Notes
          </h2>
          {entry.notes.map((note, i) => (
            <Reveal key={note.title} delay={i * 60}>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <p className="font-mono text-xs text-text-dim">Note {i + 1}</p>
                <h3 className="mt-1 font-display text-base font-semibold text-text">
                  {note.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{note.body}</p>
                {note.commands && note.commands.length > 0 && (
                  <CommandBlock commands={note.commands} className="mt-4" />
                )}
                {note.screenshot && (
                  <LearningScreenshot
                    title={note.screenshot.title}
                    lines={note.screenshot.lines}
                    image={note.screenshot.image}
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {entry.references.length > 0 && (
          <Reveal delay={80} className="mt-10 rounded-2xl border border-border bg-surface p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text">
              <ExternalLink className="h-4.5 w-4.5 text-accent" aria-hidden />
              References
            </h2>
            <ul className="mt-3 space-y-2">
              {entry.references.map((reference) => (
                <li key={reference.url}>
                  <a
                    href={reference.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-accent"
                  >
                    {reference.label}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {(previous || next) && (
          <nav className="mt-14 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            {previous ? (
              <Link
                href={`/learning/${previous.slug}`}
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
                href={`/learning/${next.slug}`}
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
