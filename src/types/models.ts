export type PublishStatus = 'draft' | 'published';

export type TimelineType = 'work' | 'education' | 'award' | 'other';
export type SkillCategory = 'frontend' | 'backend' | 'design' | 'tool' | 'other';

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
}

export interface TimelineItem {
  id: string;
  period: string;
  title: string;
  organization: string;
  description?: string;
  type: TimelineType;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  category: SkillCategory;
  level: number;
}

export interface Profile {
  name: string;
  headline: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  location: string;
  email: string;
  socials: SocialLink[];
  timeline: TimelineItem[];
  skills: Skill[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverUrl?: string;
  tags: string[];
  techStack: string[];
  demoUrl?: string;
  repoUrl?: string;
  status: PublishStatus;
  featured: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverUrl?: string;
  tags: string[];
  status: PublishStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  content: string;
  createdAt: string;
}

export type ProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;
export type MessageInput = Pick<ContactMessage, 'name' | 'email' | 'subject' | 'content'>;
