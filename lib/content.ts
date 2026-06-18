import profileData from "@/data/profile.json";
import experienceData from "@/data/experience.json";
import certificationsData from "@/data/certifications.json";
import skillsData from "@/data/skills.json";
import projectsData from "@/data/projects.json";
import labsData from "@/data/labs.json";
import learningData from "@/data/learning.json";
import type {
  Profile,
  ExperienceEntry,
  Certification,
  SkillGroup,
  Project,
  Lab,
  LearningEntry,
} from "@/lib/types";

export const profile = profileData as Profile;
export const experience = experienceData as ExperienceEntry[];
export const certifications = certificationsData as Certification[];
export const skillGroups = skillsData as SkillGroup[];
export const projects = projectsData as Project[];
export const labs = labsData as Lab[];
export const learning = learningData as LearningEntry[];

/** All labs, most recent first. */
export function getAllLabs(): Lab[] {
  return [...labs].sort((a, b) => b.date.localeCompare(a.date));
}

/** A single lab by its slug, or undefined if it doesn't exist. */
export function getLabBySlug(slug: string): Lab | undefined {
  return labs.find((lab) => lab.slug === slug);
}

/** Unique list of lab categories, in first-seen order. */
export function getLabCategories(): string[] {
  return Array.from(new Set(labs.map((lab) => lab.category)));
}

/** Slugs for every lab — used by generateStaticParams. */
export function getAllLabSlugs(): string[] {
  return labs.map((lab) => lab.slug);
}

/** All learning notes, most recent first. */
export function getAllLearning(): LearningEntry[] {
  return [...learning].sort((a, b) => b.date.localeCompare(a.date));
}

/** A single learning note by its slug, or undefined if it doesn't exist. */
export function getLearningBySlug(slug: string): LearningEntry | undefined {
  return learning.find((entry) => entry.slug === slug);
}

/** Unique list of learning categories, in first-seen order. */
export function getLearningCategories(): string[] {
  return Array.from(new Set(learning.map((entry) => entry.category)));
}

/** Slugs for every learning note — used by generateStaticParams. */
export function getAllLearningSlugs(): string[] {
  return learning.map((entry) => entry.slug);
}
