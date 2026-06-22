export interface Profile {
  name: string;
  initials: string;
  role: string;
  subtitle: string;
  location: string;
  remote: string;
  email: string;
  phone: string;
  github: string;
  githubHandle: string;
  availability: string;
  yearsExperience: number;
  headline: string;
  summary: string;
  stats: { label: string; value: string }[];
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  summary: string;
  highlights: string[];
  stack: string[];
}

export type CertificationStatus = "completed" | "in-progress";

export interface Certification {
  id: string;
  name: string;
  exam?: string;
  issuer: string;
  status: CertificationStatus;
  date: string | null;
  credentialUrl: string | null;
  description: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  tagline: string;
  featured: boolean;
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  period: string;
  summary: string;
  tags: string[];
}

export type LabStatus = "completed" | "in-progress" | "planned";

export interface LabStep {
  title: string;
  description: string;
  commands?: string[];
}

export interface LabLinks {
  github?: string;
  notes?: string;
  live?: string;
}

export interface Lab {
  slug: string;
  title: string;
  category: string;
  status: LabStatus;
  date: string;
  summary: string;
  environment: string[];
  objectives: string[];
  steps: LabStep[];
  outcomes: string[];
  tags: string[];
  links?: LabLinks;
}

export interface LearningReference {
  label: string;
  url: string;
}

export interface LearningNote {
  title: string;
  body: string;
  commands?: string[];
  screenshot?: {
    title: string;
    lines?: string[];
    image?: {
      src?: string;
      alt: string;
      placeholder?: string;
    };
  };
}

export interface LearningEntry {
  slug: string;
  title: string;
  category: string;
  status: LabStatus;
  date: string;
  summary: string;
  purpose: string;
  keyPoints: string[];
  notes: LearningNote[];
  references: LearningReference[];
  tags: string[];
}
