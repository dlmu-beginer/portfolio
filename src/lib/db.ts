import type {
  ContactMessage,
  MessageInput,
  Post,
  PostInput,
  Profile,
  Project,
  ProjectInput,
} from '../types/models';
import { seedPosts, seedProfile, seedProjects } from './seed';

const KEY = {
  profile: 'pf:profile',
  projects: 'pf:projects',
  posts: 'pf:posts',
  messages: 'pf:messages',
  seeded: 'pf:seeded',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (error) {
    console.warn(`[db] 读取 ${key} 失败，已使用默认值`, error);
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('[db] 写入失败', error);
    alert('本地存储空间不足，请清理浏览器数据后重试。');
  }
}

function uid(): string {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function now(): string {
  return new Date().toISOString();
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

// ---------------------------------------------------------------- seed data

export const emptyProfile: Profile = {
  name: '',
  headline: '',
  tagline: '',
  bio: '',
  avatarUrl: '',
  location: '',
  email: '',
  socials: [],
  timeline: [],
  skills: [],
};

// ---------------------------------------------------------------- seeding

export function ensureSeed(): void {
  try {
    if (localStorage.getItem(KEY.seeded) === 'true') return;
    write(KEY.profile, seedProfile);
    write(KEY.projects, seedProjects);
    write(KEY.posts, seedPosts);
    write(KEY.messages, []);
    localStorage.setItem(KEY.seeded, 'true');
  } catch (error) {
    console.error('[db] 初始化演示数据失败', error);
  }
}

// ---------------------------------------------------------------- profile

export function getProfile(): Profile {
  const stored = read<Partial<Profile>>(KEY.profile, {});
  // 合并种子默认值，保证后续新增字段在老数据里也有值
  return clone({ ...seedProfile, ...stored });
}

export function saveProfile(profile: Profile): void {
  write(KEY.profile, profile);
}

// ---------------------------------------------------------------- projects

function sortProjects(list: Project[]): Project[] {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.order !== b.order) return a.order - b.order;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

export function listProjects(): Project[] {
  return clone(sortProjects(read<Project[]>(KEY.projects, [])));
}

export function listPublishedProjects(): Project[] {
  return clone(
    sortProjects(read<Project[]>(KEY.projects, []).filter((item) => item.status === 'published')),
  );
}

export function getProjectBySlug(slug: string): Project | undefined {
  const found = read<Project[]>(KEY.projects, []).find(
    (item) => item.slug === slug && item.status === 'published',
  );
  return found ? clone(found) : undefined;
}

export function getProjectById(id: string): Project | undefined {
  const found = read<Project[]>(KEY.projects, []).find((item) => item.id === id);
  return found ? clone(found) : undefined;
}

export function isSlugTaken(slug: string, excludeId?: string): boolean {
  const inProjects = read<Project[]>(KEY.projects, []).some(
    (item) => item.slug === slug && item.id !== excludeId,
  );
  const inPosts = read<Post[]>(KEY.posts, []).some(
    (item) => item.slug === slug && item.id !== excludeId,
  );
  return inProjects || inPosts;
}

export function createProject(input: ProjectInput): Project {
  const projects = read<Project[]>(KEY.projects, []);
  if (isSlugTaken(input.slug)) throw new Error('该 slug 已被使用');
  const stamp = now();
  const project: Project = { ...input, id: uid(), createdAt: stamp, updatedAt: stamp };
  write(KEY.projects, [project, ...projects]);
  return clone(project);
}

export function updateProject(id: string, patch: Partial<ProjectInput>): Project {
  const projects = read<Project[]>(KEY.projects, []);
  const index = projects.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('项目不存在');
  if (patch.slug && isSlugTaken(patch.slug, id)) throw new Error('该 slug 已被使用');
  const updated: Project = { ...projects[index], ...patch, updatedAt: now() };
  projects[index] = updated;
  write(KEY.projects, projects);
  return clone(updated);
}

export function deleteProject(id: string): void {
  write(
    KEY.projects,
    read<Project[]>(KEY.projects, []).filter((item) => item.id !== id),
  );
}

// ---------------------------------------------------------------- posts

function sortPosts(list: Post[]): Post[] {
  return [...list].sort((a, b) => (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt));
}

export function listPosts(): Post[] {
  return clone(sortPosts(read<Post[]>(KEY.posts, [])));
}

export function listPublishedPosts(): Post[] {
  return clone(sortPosts(read<Post[]>(KEY.posts, []).filter((item) => item.status === 'published')));
}

export function getPostBySlug(slug: string): Post | undefined {
  const found = read<Post[]>(KEY.posts, []).find(
    (item) => item.slug === slug && item.status === 'published',
  );
  return found ? clone(found) : undefined;
}

export function getPostById(id: string): Post | undefined {
  const found = read<Post[]>(KEY.posts, []).find((item) => item.id === id);
  return found ? clone(found) : undefined;
}

export function createPost(input: PostInput): Post {
  const posts = read<Post[]>(KEY.posts, []);
  if (isSlugTaken(input.slug)) throw new Error('该 slug 已被使用');
  const stamp = now();
  const post: Post = {
    ...input,
    id: uid(),
    publishedAt: input.status === 'published' ? (input.publishedAt ?? stamp) : input.publishedAt,
    createdAt: stamp,
    updatedAt: stamp,
  };
  write(KEY.posts, [post, ...posts]);
  return clone(post);
}

export function updatePost(id: string, patch: Partial<PostInput>): Post {
  const posts = read<Post[]>(KEY.posts, []);
  const index = posts.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('文章不存在');
  if (patch.slug && isSlugTaken(patch.slug, id)) throw new Error('该 slug 已被使用');
  const nextStatus = patch.status ?? posts[index].status;
  const updated: Post = {
    ...posts[index],
    ...patch,
    publishedAt:
      nextStatus === 'published'
        ? (patch.publishedAt ?? posts[index].publishedAt ?? now())
        : patch.publishedAt ?? posts[index].publishedAt,
    updatedAt: now(),
  };
  posts[index] = updated;
  write(KEY.posts, posts);
  return clone(updated);
}

export function deletePost(id: string): void {
  write(
    KEY.posts,
    read<Post[]>(KEY.posts, []).filter((item) => item.id !== id),
  );
}

// ---------------------------------------------------------------- messages

export function createMessage(input: MessageInput): ContactMessage {
  const message: ContactMessage = { ...input, id: uid(), createdAt: now() };
  write(KEY.messages, [message, ...read<ContactMessage[]>(KEY.messages, [])]);
  return clone(message);
}

export function listMessages(): ContactMessage[] {
  return clone(read<ContactMessage[]>(KEY.messages, []));
}
