import type { Metadata } from "next";
import { LearningExplorer } from "@/components/LearningExplorer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllLearning, getLearningCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Learning Notes",
  description:
    "Teaching notes, command references, and quick examples for Linux, RHCSA practice, and systems administration.",
};

export default function LearningPage() {
  const entries = getAllLearning();
  const categories = getLearningCategories();

  return (
    <div className="bg-glow">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <SectionHeading
          path="~/learning/"
          title="Learning notes"
          description="Short teaching entries for commands, concepts, references, and study notes — built for quick review and practical examples."
        />

        <div className="mt-10">
          <LearningExplorer entries={entries} categories={categories} />
        </div>
      </div>
    </div>
  );
}
