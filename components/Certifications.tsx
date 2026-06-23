import { Award, ExternalLink, BadgeCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { certifications } from "@/lib/content";
import Image from "next/image";


export function Certifications() {
  const rhcsa = certifications.find((c) => c.id === "rhcsa");
  const ccna = certifications.find(c => c.id === "ccna");
  const others = certifications.filter((c) => c.id !== "rhcsa" && c.id !== "ccna");

  return (
    <section id="certifications" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal>
          <SectionHeading path="~/certifications" title="Certifications" />
        </Reveal>

        {rhcsa && (
          <Reveal delay={100} className="mt-10">
            <div className="rounded-2xl border border-accent-border bg-accent-soft/40 p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-accent-border bg-accent-soft text-accent">
                    <BadgeCheck className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-text sm:text-xl">
                      {rhcsa.name}
                    </h3>
                    <p className="mt-0.5 font-mono text-xs text-text-dim">
                      {rhcsa.issuer} · Exam {rhcsa.exam}
                    </p>
                  </div>
                </div>
                <StatusBadge status="completed" label="Certified" />
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted">
                {rhcsa.description}
              </p>

              {rhcsa.credentialUrl ? (
                <a
                  href={rhcsa.credentialUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:text-accent-bright"
                >
                  View credential
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              ) : (
                <p className="mt-5 font-mono text-xs text-text-dim">
                  credential ID to be added once issued — see ~/labs for the work behind it
                </p>
              )}
            </div>
          </Reveal>
        )}

        {ccna && (
          <Reveal delay={100} className="mt-10">
            <div className="rounded-2xl border border-accent-border bg-accent-soft/40 p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                 <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-border bg-bg-soft rounded-full text-text-muted">
                      {ccna.logo ? (
                        <Image
                          src={ccna.logo}
                          alt={`${ccna.name} logo`}
                          width={26}
                          height={26}
                          className="h-10 w-10 object-contain rounded-full"
                        />
                      ) : (
                        <BadgeCheck className="h-4.5 w-4.5" aria-hidden />
                      )}
                    </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-text sm:text-xl">
                      {ccna.name}
                    </h3>
                    <p className="mt-0.5 font-mono text-xs text-text-dim">
                      {ccna.issuer} · Exam {ccna.exam}
                    </p>
                  </div>
                </div>
                <StatusBadge status="completed" label="Certified" />
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted">
                {ccna.description}
              </p>

              {ccna.credentialUrl ? (
                <a
                  href={ccna.credentialUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:text-accent-bright"
                >
                  View credential
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              ) : (
                <p className="mt-5 font-mono text-xs text-text-dim">
                  credential ID to be added once issued — see ~/labs for the work behind it
                </p>
              )}
            </div>
          </Reveal>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((cert, i) => (
            <Reveal key={cert.id} delay={160 + i * 70}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-soft text-text-muted">
                    {/* <Award className="h-4.5 w-4.5" aria-hidden /> */}


                    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-border bg-bg-soft rounded-full text-text-muted">
                      {cert.logo ? (
                        <Image
                          src={cert.logo}
                          alt={`${cert.name} logo`}
                          width={26}
                          height={26}
                          className="h-10 w-10 object-contain rounded-full"
                        />
                      ) : (
                        <BadgeCheck className="h-4.5 w-4.5" aria-hidden />
                      )}
                    </span>
                  </span>
                  <StatusBadge status="completed" label="Certified" />
                </div>

                <h3 className="mt-4 font-display text-base font-semibold leading-snug text-text">
                  {cert.name}
                </h3>
                <p className="mt-1 font-mono text-xs text-text-dim">{cert.issuer}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
                  {cert.description}
                </p>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:text-accent-bright"
                  >
                    View credential
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
