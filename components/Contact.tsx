"use client";

import { SubmitEvent, useState} from "react";
import { Mail, Phone, MapPin, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { GithubIcon, LinkedInIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/lib/content";

type FormState = "idle" | "submitting" | "success" | "error";

const FIELD_CLASS =
  "w-full rounded-lg border border-border bg-bg-soft px-3.5 py-2.5 text-sm text-text placeholder:text-text-dim transition-colors focus:border-accent-border focus:outline-none";

const LABEL_CLASS = "font-mono text-xs text-text-muted";

export function Contact() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""), // honeypot
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setState("error");
        setErrorMessage(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      setState("success");
      form.reset();
    } catch {
      setState("error");
      setErrorMessage("Network error — please try again in a moment.");
    }
  }

  return (
    <section id="contact" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal>
          <SectionHeading
            path="~/contact.sh"
            title="Get in touch"
            description="Hiring for a Linux/RHEL admin role, or have a question about a lab? Send a message — it lands straight in my inbox."
          />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-5 lg:gap-12">
          <Reveal className="lg:col-span-2" delay={80}>
            <div className="space-y-4">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-text-muted transition-colors hover:border-accent-border hover:text-text"
              >
                <Mail className="h-4.5 w-4.5 text-accent" aria-hidden />
                {profile.email}
              </a>
              <a
                href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-text-muted transition-colors hover:border-accent-border hover:text-text"
              >
                <Phone className="h-4.5 w-4.5 text-accent" aria-hidden />
                {profile.phone}
              </a>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-text-muted">
                <MapPin className="h-4.5 w-4.5 text-accent" aria-hidden />
                {profile.location} · {profile.remote}
              </div>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-text-muted transition-colors hover:border-accent-border hover:text-text"
              >
                <GithubIcon className="h-4.5 w-4.5 text-accent" />
                github.com/{profile.githubHandle}
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-text-muted transition-colors hover:border-accent-border hover:text-text"
              >
                
                <LinkedInIcon className="h-4.5 w-4.5 text-accent" />
                linkedin.com/in/{profile.linkedinHandle}
              </a>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-3" delay={140}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot — hidden from real visitors */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={LABEL_CLASS}>
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Jane Recruiter"
                    className={`${FIELD_CLASS} mt-1.5`}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={LABEL_CLASS}>
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={200}
                    placeholder="you@company.com"
                    className={`${FIELD_CLASS} mt-1.5`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className={LABEL_CLASS}>
                  Subject <span className="text-text-dim">(optional)</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  maxLength={150}
                  placeholder="Linux Administrator role at..."
                  className={`${FIELD_CLASS} mt-1.5`}
                />
              </div>

              <div>
                <label htmlFor="message" className={LABEL_CLASS}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  maxLength={5000}
                  rows={5}
                  placeholder="Hi Firoz, we're looking for..."
                  className={`${FIELD_CLASS} mt-1.5 resize-y`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-mono text-sm font-medium text-white transition-colors hover:bg-accent-bright disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {state === "submitting" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                  {state === "submitting" ? "Sending…" : "Send message"}
                </button>

                {state === "success" && (
                  <p className="inline-flex items-center gap-1.5 font-mono text-sm text-green">
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    Message sent — thanks!
                  </p>
                )}
                {state === "error" && (
                  <p className="inline-flex items-center gap-1.5 font-mono text-sm text-accent-bright">
                    <AlertCircle className="h-4 w-4" aria-hidden />
                    {errorMessage}
                  </p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
