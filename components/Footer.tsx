import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedInIcon } from "@/components/ui/icons";
import { profile } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-sm text-text">{profile.name}</p>
            <p className="mt-1 text-sm text-text-muted">{profile.role}</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={profile.linkedin}
              target="_blank"
              className="text-text-muted transition-colors hover:text-accent"
              aria-label="Email"
            >
              <LinkedInIcon className="h-4.5 w-4.5" />
            </a>
            
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="text-text-muted transition-colors hover:text-accent"
              aria-label="GitHub"
            >
              <GithubIcon className="h-4.5 w-4.5" />
            </a>

            <a
              href={`mailto:${profile.email}`}
              className="text-text-muted transition-colors hover:text-accent"
              aria-label="Email"
            >
              <Mail className="h-4.5 w-4.5" />

            </a>
            
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 font-mono text-xs text-text-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <p>
            Designed & developed by{" "}
            <Link href="#" target="_self" rel="noreferrer noopener" className="hover:text-text">
              FIROZ
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
