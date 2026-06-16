import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { experience } from "@/lib/content";

export function Experience() {
  return (
    <section id="experience" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal>
          <SectionHeading path="~/experience.log" title="Experience" />
        </Reveal>

        <div className="mt-12 space-y-10">
          {experience.map((job, i) => (
            <Reveal key={job.id} delay={i * 100}>
              <article className="relative grid gap-4 border-l border-border pl-6 sm:grid-cols-[12rem_1fr] sm:gap-8 sm:pl-8">
                <span
                  className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-bg bg-accent sm:-left-[5px]"
                  aria-hidden
                />

                <div className="font-mono text-sm text-text-muted">
                  <p className="text-text">
                    {job.start} — {job.end}
                  </p>
                  {job.current && (
                    <p className="mt-1 inline-flex items-center gap-1.5 text-green">
                      <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
                      active
                    </p>
                  )}
                  <p className="mt-1 text-text-dim">{job.location}</p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-semibold text-text">{job.title}</h3>
                  <p className="mt-1 text-text-muted">{job.company}</p>
                  <p className="mt-3 text-text-muted">{job.summary}</p>

                  <ul className="mt-4 space-y-2">
                    {job.highlights.map((point) => (
                      <li key={point} className="flex gap-2 text-sm leading-relaxed text-text-muted">
                        <span className="mt-1 shrink-0 font-mono text-accent">›</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
