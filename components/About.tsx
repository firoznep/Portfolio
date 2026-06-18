import { Mail, MapPin, Clock, Languages } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { profile } from "@/lib/content";


const INFO_ROWS = [
  { icon: MapPin, label: "Location", value: `${profile.location} · ${profile.remote}` },
  { icon: Clock, label: "Experience", value: `${profile.yearsExperience}+ years in IT infrastructure` },
  { icon: Mail, label: "Email", value: profile.email },
  { icon: GithubIcon, label: "GitHub", value: `@${profile.githubHandle}` },
  { icon: Languages, label: "Languages", value: "English, Hindi, Urdu, Nepali" },
];

export function About() {
  return (
    <section id="about" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal>
          <SectionHeading path="~/about.md" title="About" />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-16">
          <Reveal as="div" className="lg:col-span-2" delay={80}>
            <div className="space-y-5 text-base leading-relaxed text-text-muted sm:text-lg">
              <p> <span className="font-mono font-bold text-xl text-text"> Network Engineer and Systems Administrator </span> with 8+ years of experience delivering enterprise infrastructure, network operations, Windows Server administration, virtualization, and cloud-based solutions. Recently earned the <span className="font-mono text-accent">RHCSA (EX200)</span>  certification, strengthening hands-on expertise in SELinux, LVM, systemd, firewalld, shell scripting, and enterprise Linux administration. Experienced in deploying, managing, and optimizing Red Hat Enterprise Linux workloads both on-premises and on Azure Red Hat Virtual Machines, with a strong focus on security, automation, and operational excellence.</p>
              <p>
                Leveraging Linux extensively for server administration, Bash automation, and self-hosted services secured with Let's Encrypt. Through structured RHCSA-focused labs and real-world deployments, I developed practical expertise in storage management, networking, security hardening, automation, and troubleshooting across <span className="font-mono text-accent">RHCSA </span> environments.
                
              </p>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <TerminalWindow title="firoz@rhel:~ — neofetch">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-accent-border bg-accent-soft font-display text-xl font-semibold text-accent"
                  aria-hidden
                >
                  {profile.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-text">{profile.name}</p>
                  <p className="text-text-dim">{profile.role}</p>
                </div>
              </div>

              <div className="mt-5 h-px bg-border" />

              <dl className="mt-5 space-y-3">
                {INFO_ROWS.map((row) => (
                  <div key={row.label} className="flex items-start gap-3">
                    <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-text-dim" aria-hidden />
                    <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
                      <dt className="text-text-dim">{row.label}:</dt>
                      <dd className="truncate text-text-muted">{row.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </TerminalWindow>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
