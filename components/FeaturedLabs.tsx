import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LabCard } from "@/components/LabCard";
import { getAllLabs } from "@/lib/content";

export function FeaturedLabs() {
  const featured = getAllLabs().slice(0, 3);

  return (
    <section id="labs" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            path="~/labs/"
            title="Home lab notebook"
            description="Hands-on RHEL exercises, written up as I work through them — each one maps to a slice of the RHCSA exam objectives. New entries are added straight from a JSON file."
          />
          <Link
            href="/labs"
            className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-sm text-accent hover:text-accent-bright"
          >
            View all labs
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((lab, i) => (
            <Reveal key={lab.slug} delay={i * 90}>
              <LabCard lab={lab} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
