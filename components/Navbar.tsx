"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, TerminalSquare } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { profile } from "@/lib/content";

const NAV_LINKS = [
  { id: "about", label: "about", href: "/#about" },
  { id: "skills", label: "skills", href: "/#skills" },
  { id: "experience", label: "experience", href: "/#experience" },
  { id: "certifications", label: "certs", href: "/#certifications" },
  { id: "contact", label: "contact", href: "/#contact" },
  { id: "labs", label: "labs", href: "/labs" },
];

const HOME_SECTION_IDS = ["about", "skills", "experience", "certifications", "labs", "contact"];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for the translucent header background.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy active section, only meaningful on the homepage.
  useEffect(() => {
    if (pathname !== "/") return;

    const sections = HOME_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  function isActive(linkId: string) {
    if (linkId === "labs") return pathname.startsWith("/labs");
    return pathname === "/" && activeId === linkId;
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors",
        scrolled
          ? "border-border bg-bg/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm text-text transition-colors hover:text-accent"
        >
          <TerminalSquare className="h-4 w-4 text-accent" aria-hidden />
          <span>
            firoz<span className="text-text-dim">@</span>rhel
            <span className="text-text-dim">:~$</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 font-mono text-sm transition-colors",
                isActive(link.id)
                  ? "text-accent"
                  : "text-text-muted hover:text-text"
              )}
            >
              cd {link.label}/
            </Link>
          ))}
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="ml-2 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 font-mono text-sm text-text-muted transition-colors hover:border-accent-border hover:text-text"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            github
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md border border-border p-2 text-text-muted md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="border-t border-border bg-bg px-6 py-4 md:hidden"
          aria-label="Primary"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2.5 font-mono text-sm transition-colors",
                    isActive(link.id)
                      ? "bg-accent-soft text-accent"
                      : "text-text-muted hover:bg-surface hover:text-text"
                  )}
                >
                  cd {link.label}/
                </Link>
              </li>
            ))}
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center gap-1.5 rounded-md px-3 py-2.5 font-mono text-sm text-text-muted hover:bg-surface hover:text-text"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                github.com/{profile.githubHandle}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
