"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { profile } from "@/lib/content";

interface BootLine {
  command: string;
  output: string[];
}

const BOOT_SEQUENCE: BootLine[] = [
  {
    command: "whoami",
    output: ["firoz-miya"],
  },
  {
    command: "cat role.txt",
    output: [
      "RHCSA-Certified Linux System Administrator",
      "Network Engineer & Systems Administrator — 8+ yrs",
    ],
  },
  {
    command: "./status.sh --check",
    output: [
      "[ ok ]  8+ years in network & systems administration",
      "[ ok ]  CCNA certified",
      "[ ok ]  RHCSA (EX200) — certified",
      "[ ok ]  Based in Doha, Qatar — available immediately",
    ],
  },
];

const TYPE_SPEED_MS = 32;
const LINE_PAUSE_MS = 350;

export function Hero() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // One-time read of a browser capability on mount — there's no
  // SSR-safe equivalent, so this can't be derived during render.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
  }, []);

  const done = reducedMotion || lineIndex >= BOOT_SEQUENCE.length;

  useEffect(() => {
    if (done) return;

    const currentCommand = BOOT_SEQUENCE[lineIndex].command;

    if (charIndex < currentCommand.length) {
      const timeout = setTimeout(() => setCharIndex((c) => c + 1), TYPE_SPEED_MS);
      return () => clearTimeout(timeout);
    }

    // Command fully typed — pause, then reveal output and move on.
    const timeout = setTimeout(() => {
      setLineIndex((l) => l + 1);
      setCharIndex(0);
    }, LINE_PAUSE_MS + BOOT_SEQUENCE[lineIndex].output.length * 220);

    return () => clearTimeout(timeout);
  }, [charIndex, lineIndex, done]);

  return (
    <section className="relative overflow-hidden" id="top">
      <div className="bg-grid bg-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 sm:pt-24 lg:grid-cols-2 lg:items-center lg:pb-28 lg:pt-32">
        <div>
          {/* <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
            {profile.availability}
          </p> */}

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-text sm:text-5xl lg:text-6xl">
            {profile.name}
          </h1>

          <p className="mt-3 font-mono text-base text-accent sm:text-lg">{profile.role}</p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
            {profile.headline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/labs"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-white transition-colors hover:bg-accent-bright"
            >
              View home labs
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-mono text-sm font-medium text-text transition-colors hover:border-accent-border hover:text-accent"
            >
              Get in touch
            </Link>
            <a
              href="https://firoznep.github.io/cv"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 px-2 py-3 font-mono text-sm text-text-muted transition-colors hover:text-text"
            >
              View CV
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {profile.stats.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-2xl font-semibold text-text sm:text-3xl">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-xs text-text-muted">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <TerminalWindow title="firoz@rhel:~" className="lg:ml-auto lg:w-full lg:max-w-lg">
          <div className="space-y-4">
            {BOOT_SEQUENCE.map((line, i) => {
              if (i > lineIndex) return null;
              const isCurrent = i === lineIndex && !done;
              const text = isCurrent ? line.command.slice(0, charIndex) : line.command;
              const showOutput = i < lineIndex || done;

              return (
                <div key={line.command}>
                  <p className={isCurrent ? "cursor" : undefined}>
                    <span className="text-accent">$ </span>
                    <span className="text-text">{text}</span>
                  </p>
                  {showOutput &&
                    line.output.map((out) => (
                      <p key={out} className="pl-4 text-text-muted">
                        {out}
                      </p>
                    ))}
                </div>
              );
            })}
            {done && (
              <p className="cursor">
                <span className="text-accent">$ </span>
              </p>
            )}
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
}
