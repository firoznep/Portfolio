import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LabsExplorer } from "@/components/LabsExplorer";
import { getAllLabs, getLabCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Home Lab Notebook",
  description:
    "Hands-on RHEL exercises covering storage, security, automation, networking and identity — written up on the way to the RHCSA certification.",
};

export default function LabsPage() {
  const labs = getAllLabs();
  const categories = getLabCategories();

  return (
    <div className=" bg-glow">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <SectionHeading
          path="~/labs/"
          title="Home lab notebook"
          description="Every entry here is a real exercise run on a RHEL VM — what I set out to do, the commands I used, what broke, and how I fixed it. Filter by category, or open a lab for the full write-up."
        />

        <div className="mt-10">
          <LabsExplorer labs={labs} categories={categories} />
        </div>
      </div>
    </div>
  );
}
