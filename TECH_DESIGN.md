# 个人作品集网站 · 技术设计文档（TECH_DESIGN）

| 项目 | 内容 |
| --- | --- |
| 版本 | v2.0（极简版） |
| 日期 | 2026-10-20 |
| 对应 PRD | `PRD.md` v2.0 |
| 部署目标 | Vercel 静态托管 |

---

## 1. 总原则

1. **纯前端、单机数据**：`localStorage` 是唯一数据源，没有网络请求，没有后端。
2. **少量抽象**：只有「数据层」和「认证」两层薄封装，其余逻辑写在组件里。
3. **不做过度设计**：没有全局状态库、没有请求缓存库、没有 schema 校验库、没有测试框架。
4. **视觉优先**：星空、毛玻璃、渐变、微交互要做出质感；性能问题用参数控制（粒子数、DPR）。
5. **可构建**：TypeScript 严格模式 + `npm run build` 必须通过，部署 Vercel 刷新子路由不 404。

---

## 2. 技术栈

| 类别 | 选择 |
| --- | --- |
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 |
| 路由 | react-router-dom 6（`createBrowserRouter`） |
| 样式 | TailwindCSS 3.4 + CSS 变量 |
| Markdown | `react-markdown` + `remark-gfm` |
| 图标 | `lucide-react` |
| 部署 | Vercel（静态） |

**依赖清单**

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0",
    "lucide-react": "^0.441.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.45",
    "tailwindcss": "^3.4.10",
    "typescript": "~5.5.4",
    "vite": "^5.4.3"
  }
}
```

脚本：

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "typecheck": "tsc --noEmit"
}
```

> 不安装：UI 组件库、动画库、状态库、测试框架、ESLint（可选，不影响构建）。

---

## 3. 目录结构

```
CursorHomework3/
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ main.tsx                  # 入口：ensureSeed() → 挂载 Provider + Router
│  ├─ App.tsx                   # RouterProvider
│  ├─ router.tsx                # 路由表（后台懒加载）
│  ├─ index.css                 # Tailwind 指令 + CSS 变量 + 基础样式
│  ├─ vite-env.d.ts
│  │
│  ├─ types/
│  │  └─ models.ts              # Profile / Project / Post / Skill / ...
│  │
│  ├─ lib/
│  │  ├─ db.ts                  # localStorage 读写、CRUD、种子数据
│  │  ├─ auth.ts                # 固定账号校验、isLoggedIn 标记
│  │  ├─ markdown.ts            # 阅读时长、摘要截断
│  │  ├─ validate.ts            # 轻量字段校验
│  │  ├─ date.ts                # 日期格式化
│  │  └─ cn.ts                  # className 合并
│  │
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ SiteLayout.tsx      # 前台外壳：StarField + Navbar + Outlet + Footer
│  │  │  ├─ Navbar.tsx
│  │  │  ├─ MobileMenu.tsx
│  │  │  ├─ Footer.tsx
│  │  │  ├─ StarField.tsx
│  │  │  └─ ScrollToTop.tsx
│  │  ├─ ui/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Input.tsx
│  │  │  ├─ Textarea.tsx
│  │  │  ├─ Badge.tsx
│  │  │  ├─ ProgressBar.tsx
│  │  │  ├─ SmartImage.tsx      # 懒加载 + 失败占位
│  │  │  ├─ Section.tsx         # 标题 + 锚点 + 间距
│  │  │  ├─ Skeleton.tsx
│  │  │  ├─ EmptyState.tsx
│  │  │  └─ Toast.tsx
│  │  ├─ home/
│  │  │  ├─ Hero.tsx
│  │  │  ├─ AboutTimeline.tsx
│  │  │  ├─ Skills.tsx
│  │  │  ├─ ProjectsSection.tsx
│  │  │  ├─ ProjectCard.tsx
│  │  │  ├─ BlogSection.tsx
│  │  │  └─ ContactSection.tsx
│  │  ├─ markdown/
│  │  │  ├─ MarkdownView.tsx
│  │  │  └─ MarkdownEditor.tsx
│  │  └─ admin/
│  │     ├─ RequireAuth.tsx
│  │     ├─ AdminLayout.tsx
│  │     ├─ Sidebar.tsx
│  │     ├─ StatCard.tsx
│  │     ├─ FormField.tsx
│  │     └─ ImageUrlField.tsx
│  │
│  ├─ pages/
│  │  ├─ HomePage.tsx
│  │  ├─ ProjectDetailPage.tsx
│  │  ├─ PostDetailPage.tsx
│  │  ├─ NotFoundPage.tsx
│  │  └─ admin/
│  │     ├─ LoginPage.tsx
│  │     ├─ DashboardPage.tsx
│  │     ├─ ProfileAdminPage.tsx
│  │     ├─ ProjectsAdminPage.tsx
│  │     ├─ ProjectEditPage.tsx
│  │     ├─ PostsAdminPage.tsx
│  │     └─ PostEditPage.tsx
│  │
│  ├─ hooks/
│  │  ├─ useScrollSpy.ts
│  │  ├─ useMediaQuery.ts
│  │  ├─ usePrefersReducedMotion.ts
│  │  └─ useBodyScrollLock.ts
│  │
│  └─ context/
│     └─ ToastContext.tsx       # 全站轻提示
│
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
├─ tailwind.config.ts
├─ postcss.config.js
├─ vercel.json
├─ .gitignore
└─ README.md
```

**放置规则**：类型进 `types/`，存储与登录进 `lib/`，复用组件进 `components/`，页面进 `pages/`。不建多余的 `services/`、`store/`、`utils/` 大杂烩。

---

## 4. 数据模型

```ts
// src/types/models.ts
export type PublishStatus = 'draft' | 'published';

export type TimelineType = 'work' | 'education' | 'award' | 'other';
export type SkillCategory = 'frontend' | 'backend' | 'design' | 'tool' | 'other';

export interface SocialLink {
  id: string;
  platform: string;   // github / email / x / linkedin / juejin / website
  label: string;
  url: string;
}

export interface TimelineItem {
  id: string;
  period: string;       // "2023.07 — 至今"
  title: string;
  organization: string;
  description?: string;
  type: TimelineType;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;         // 图标 key，如 react / typescript / node
  category: SkillCategory;
  level: number;        // 0–100
}

export interface Profile {
  name: string;
  headline: string;     // 一句话定位
  tagline: string;      // Hero 副标题
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
  content: string;      // Markdown
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
  content: string;      // Markdown
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
```

### 4.1 存储键

| Key | 类型 | 说明 |
| --- | --- | --- |
| `pf:isLoggedIn` | `"true"` / 不存在 | 登录标记（简单字符串） |
| `pf:seeded` | `"true"` | 是否已写入演示数据，防止删数据后又自动重建 |
| `pf:profile` | `Profile` | 单份个人信息 |
| `pf:projects` | `Project[]` | 项目集合 |
| `pf:posts` | `Post[]` | 文章集合 |
| `pf:messages` | `ContactMessage[]` | 留言集合 |

- 统一 `JSON.stringify/parse`；读取失败或格式损坏时回退默认值并 `console.warn`，不要让页面白屏。
- 字段以后有变化时，最省事的处理是「清空 `pf:*` 后刷新重新播种」，不做迁移框架。

### 4.2 种子数据

`ensureSeed()` 在 `main.tsx` 渲染前执行：

```ts
if (localStorage.getItem('pf:seeded') === 'true') return;
localStorage.setItem('pf:profile', JSON.stringify(defaultProfile));
localStorage.setItem('pf:projects', JSON.stringify(defaultProjects));
localStorage.setItem('pf:posts', JSON.stringify(defaultPosts));
localStorage.setItem('pf:messages', JSON.stringify([]));
localStorage.setItem('pf:seeded', 'true');
```

演示数据要求：

- 3 个项目：至少 1 个精选、1 个草稿；封面用稳定的占位图服务（如 `picsum.photos`）或渐变占位。
- 3 篇文章：含标题、摘要、正文（至少一篇含代码块与表格，用于检验排版）。
- 个人信息：头像占位、6–8 个技能、3 条时间线、3 个社交链接。

---

## 5. 数据层（`src/lib/db.ts`）

**同步函数**，组件直接调用；改完数据后 `setState` 触发重渲染即可。不模拟网络延迟。

```ts
const KEY = {
  profile: 'pf:profile',
  projects: 'pf:projects',
  posts: 'pf:posts',
  messages: 'pf:messages',
} as const;

function read<T>(key: string, fallback: T): T { /* try/catch + JSON.parse */ }
function write<T>(key: string, value: T): void { /* 捕获 QuotaExceededError，alert 提示 */ }
```

导出接口：

| 函数 | 说明 |
| --- | --- |
| `getProfile(): Profile` | 读不到返回默认空 Profile |
| `saveProfile(profile: Profile): void` | 整份覆盖 |
| `listProjects(): Project[]` | 后台用，含草稿 |
| `listPublishedProjects(): Project[]` | 前台用，过滤 `status`，按精选/order/更新时间排序 |
| `getProjectBySlug(slug): Project \| undefined` | 详情页 |
| `getProjectById(id): Project \| undefined` | 编辑页 |
| `createProject(input: ProjectInput): Project` | 生成 `id`（`crypto.randomUUID()`）与时间戳 |
| `updateProject(id, patch: Partial<ProjectInput>): Project` | 更新 `updatedAt` |
| `deleteProject(id): void` | |
| `listPosts()` / `listPublishedPosts()` / `getPostBySlug` / `getPostById` | 同上 |
| `createPost` / `updatePost` / `deletePost` | 同上 |
| `createMessage(input: MessageInput): ContactMessage` | 前台表单 |
| `listMessages(): ContactMessage[]` | 后台统计 |
| `isSlugTaken(slug, excludeId?): boolean` | 项目与文章各自独立判断 |
| `resetDemoData(): void` | 清空 `pf:*` 并重新播种（可选入口） |

约束：

- `create*`/`update*` 遇到 slug 重复时 `throw new Error('该 slug 已被使用')`，由页面 `try/catch` 显示。
- 所有返回值用 `structuredClone` 或展开拷贝，避免页面直接改动数组里的对象。
- 文章发布时 `publishedAt` 为空则补 `new Date().toISOString()`。
- 阅读时长不落库，渲染时用 `readingMinutes(content)` 计算。

---

## 6. 登录与路由守卫

### 6.1 固定账号（`src/lib/auth.ts`）

```ts
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '123456';
const LOGIN_FLAG = 'pf:isLoggedIn';

export function login(username: string, password: string): boolean {
  const ok = username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  if (ok) localStorage.setItem(LOGIN_FLAG, 'true');
  return ok;
}

export function logout(): void {
  localStorage.removeItem(LOGIN_FLAG);
}

export function isLoggedIn(): boolean {
  return localStorage.getItem(LOGIN_FLAG) === 'true';
}
```

说明：

- 这是**演示级**登录，任何人读源码都能看到账号；不要用于真实隐私数据，也不要把这个密码复用到别处。
- 登录页文案直接写出演示账号，避免评审时还要翻文档。
- 不做会话过期、不做 token、不做密码哈希（按项目边界要求）。

### 6.2 守卫

```tsx
// components/admin/RequireAuth.tsx
export function RequireAuth(): JSX.Element {
  const location = useLocation();
  if (!isLoggedIn()) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/admin/login?redirect=${redirect}`} replace />;
  }
  return <Outlet />;
}
```

`LoginPage`：

```tsx
const navigate = useNavigate();
const [params] = useSearchParams();
if (isLoggedIn()) return <Navigate to="/admin" replace />;

const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  if (!login(username, password)) { setError('账号或密码错误'); return; }
  navigate(params.get('redirect') || '/admin', { replace: true });
};
```

---

## 7. 路由

```tsx
// src/router.tsx
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const ProfileAdminPage = lazy(() => import('./pages/admin/ProfileAdminPage'));
const ProjectsAdminPage = lazy(() => import('./pages/admin/ProjectsAdminPage'));
const ProjectEditPage = lazy(() => import('./pages/admin/ProjectEditPage'));
const PostsAdminPage = lazy(() => import('./pages/admin/PostsAdminPage'));
const PostEditPage = lazy(() => import('./pages/admin/PostEditPage'));

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projects/:slug', element: <ProjectDetailPage /> },
      { path: 'blog/:slug', element: <PostDetailPage /> },
    ],
  },
  { path: 'admin/login', element: <LoginPage /> },
  {
    path: 'admin',
    element: <RequireAuth />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'profile', element: <ProfileAdminPage /> },
          { path: 'projects', element: <ProjectsAdminPage /> },
          { path: 'projects/new', element: <ProjectEditPage /> },
          { path: 'projects/:id/edit', element: <ProjectEditPage /> },
          { path: 'posts', element: <PostsAdminPage /> },
          { path: 'posts/new', element: <PostEditPage /> },
          { path: 'posts/:id/edit', element: <PostEditPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
```

- `<Suspense fallback={<PageLoader />}>` 包住 `RouterProvider`。
- 路由变化滚到顶部；`/#projects` 这类带 hash 的链接在首页挂载后定位到锚点。
- 后台全部懒加载，前台首屏不引入 Markdown 编辑器。

---

## 8. 样式系统

### 8.1 `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bg: #0b0f1a;
    --surface: #121826;
    --surface-2: #1a2233;
    --border: rgba(255, 255, 255, 0.08);
    --text: #e6eaf2;
    --muted: #94a3b8;
    --accent: #6c8cff;
    --accent-2: #38bdf8;
  }

  html { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  body { @apply bg-[var(--bg)] text-[var(--text)] antialiased; }
  ::selection { background: rgba(108, 140, 255, 0.35); }
}

@layer components {
  .glass-nav {
    @apply border-b border-white/[0.06] bg-[#0B0F1A]/70 backdrop-blur-md;
  }
  .card-surface {
    @apply rounded-2xl border border-white/[0.08] bg-[var(--surface)];
  }
  .focus-ring {
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)];
  }
}
```

### 8.2 `tailwind.config.ts`

```ts
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F1A',
        surface: { DEFAULT: '#121826', 2: '#1A2233' },
        accent: { DEFAULT: '#6C8CFF', 2: '#38BDF8' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      borderRadius: { card: '16px', control: '10px' },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
      },
      animation: { 'fade-up': 'fade-up .45s ease-out both' },
    },
  },
  plugins: [],
};
```

### 8.3 视觉要点

- **Hero**：左侧文案，右侧头像加双层渐变光晕（`blur-3xl` 色块 + 细描边圆环），背景一层径向渐变。
- **导航**：滚动前透明，滚动后 `.glass-nav`；链接 hover 出现下划线渐变；当前项用主色小圆点或文字高亮。
- **卡片**：`card-surface` + hover `-translate-y-1` + 描边提亮 + 封面图轻微 `scale-105`。
- **按钮**：主按钮渐变（`#6C8CFF → #38BDF8`）、深色文字；次按钮透明 + 描边。
- **标题**：区块标题上方加一个小号等宽标签（如 `// 01 ABOUT`），提升设计感。
- **分隔**：用渐变细线或发光圆点，不用粗边框。
- **后台**：侧边栏 `#0E1420`，菜单项选中态左侧 2px 主色条 + 半透明底；不用星空。

---

## 9. 星空背景（`StarField.tsx`）

### 9.1 参数

| 参数 | 桌面 | 手机（`< 768px`） |
| --- | --- | --- |
| 粒子数 | `min(140, floor(面积 / 14000))` | `min(40, floor(面积 / 26000))` |
| 半径 | 0.4–1.4px | 0.4–1.0px |
| 漂移速度 | 0.02–0.08 px/帧 | 0.01–0.03 px/帧 |
| 闪烁 | `sin(t·f + phase)`，幅度 0.25 | 关闭 |
| 鼠标视差 | 偏移 × 0.006，上限 8px | 关闭 |
| DPR | `min(devicePixelRatio, 2)` | 同 |

### 9.2 结构

```tsx
export function StarField(): JSX.Element {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let raf = 0;
    let stars: Star[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => { /* canvas.width = cssW*dpr; ctx.setTransform(dpr,0,0,dpr,0,0) */ };
    const build = () => { /* 按面积生成粒子（位置、半径、速度、相位、亮度） */ };
    const draw = (t: number) => { /* clearRect → 逐点 fillRect/arc，透明度随 sin 变化 */ };
    const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop); };

    resize(); build();
    if (reduced) draw(0);
    else raf = requestAnimationFrame(loop);

    const onResize = debounce(() => { resize(); build(); if (reduced) draw(0); }, 200);
    const onVisibility = () => {
      if (reduced) return;
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced, isMobile]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 h-full w-full" />;
}
```

### 9.3 实现注意

- Canvas 放在 `SiteLayout` 最底层，`z-index: 0`；内容包在 `relative z-10`。
- 不使用 `shadowBlur` 画光晕（开销大）；需要亮点时叠两个不同透明度的圆。
- 鼠标视差用 `pointermove` + `requestAnimationFrame` 节流，离开视口或手机端不绑定。
- 首帧先画一次，避免白屏闪一下。
- 页面隐藏时暂停，回来继续；组件卸载必须 `cancelAnimationFrame`。
- 后台不渲染该组件。

---

## 10. Markdown

### 10.1 渲染

```tsx
// components/markdown/MarkdownView.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MarkdownView({ content }: { content: string }): JSX.Element {
  return (
    <div className="prose prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-[var(--accent)] prose-pre:bg-[#0D1117] prose-pre:border prose-pre:border-white/10">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
          ),
          img: ({ src, alt }) => <SmartImage src={src} alt={alt ?? ''} className="rounded-xl" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

- `react-markdown` 默认不渲染裸 HTML，正好满足「不做额外安全清洗」的需求。
- 需要排版细节时用 `@tailwindcss/typography`（`prose prose-invert`）；若不想加插件，则手写 `.markdown-body` 样式。**任选其一，不混用。**

### 10.2 编辑器

- 布局：`md:grid md:grid-cols-2 md:gap-4`；手机端「编辑 / 预览」切换按钮。
- 左：`<textarea>`，等宽字体，`min-h-[420px]`，Tab 插入两空格，`Ctrl/Cmd + S` 触发保存。
- 右：`MarkdownView` 实时预览（直接随 state 更新即可，不需要防抖；文章很长时可用 `useDeferredValue`）。
- 工具栏：加粗、斜体、标题、链接、代码块、列表、引用；点击在光标处插入语法。
- 状态栏：字符数、估算阅读时长、未保存提示。
- 表单校验只在保存时做：标题必填、slug 合法且唯一、摘要长度限制。

### 10.3 阅读时长

```ts
export function readingMinutes(markdown: string): number {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, ' ');
  const cjk = (plain.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = (plain.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.round(cjk / 400 + words / 200));
}
```

---

## 11. 表单与校验（`src/lib/validate.ts`）

只做必要校验，够用即可：

```ts
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export function requireText(v: string, min: number, max: number): string | null {
  const len = v.trim().length;
  if (len === 0) return '此项为必填';
  if (len < min) return `至少 ${min} 个字符`;
  if (len > max) return `不能超过 ${max} 个字符`;
  return null;
}

export const isSlug = (v: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
```

- 项目/文章：`slug` 由标题自动生成（中文标题用拼音不现实，可初始为空由用户填，或生成 `project-<时间戳>` 兜底）。
- 图片 URL 只存字符串，不做协议校验；预览失败由 `SmartImage` 显示占位。
- 错误显示在字段下方，红色小字；不必做 `aria` 体系。
- 技能熟练度用 `<input type="range">` + 数字显示，天然限制 0–100。

---

## 12. 性能与构建

- 路由级 `lazy`：后台页面与 Markdown 编辑器动态加载。
- 图片：`SmartImage` 统一 `loading="lazy"`、`decoding="async"`、固定比例容器、失败占位。
- 动效只用 `transform` / `opacity`。
- `IntersectionObserver` 做一次入场动画后 `unobserve`。
- 构建产物 `dist/`；`tsc -b` 必须先过。
- 体积目标：首屏 gzip < 250KB；如超出，先检查是否误把后台或 `rehype` 相关依赖打进主包。

---

## 13. Vercel 部署

`vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- 框架预设选 Vite；Node 版本 18+。
- `rewrites` 必须保留，否则直接访问 `/admin/projects` 或刷新详情页会 404。
- 无环境变量、无服务端函数。
- 部署后自查：`/`、`/projects/<slug>`、`/admin/login`、`/admin` 直接刷新均正常。

---

## 14. 关键文件职责

| 文件 | 负责 | 不负责 |
| --- | --- | --- |
| `lib/db.ts` | 所有 localStorage 读写与种子数据 | UI 提示、路由 |
| `lib/auth.ts` | 固定账号判断、登录标记 | 加密、会话管理 |
| `lib/markdown.ts` | 阅读时长、摘要 | 渲染组件 |
| `components/layout/StarField.tsx` | Canvas 绘制与生命周期 | 页面内容 |
| `components/admin/RequireAuth.tsx` | 登录拦截与重定向 | 登录表单 |
| `pages/admin/ProjectEditPage.tsx` | 表单状态、校验、保存 | 直接操作 localStorage |
| `router.tsx` | 路由表与懒加载 | 业务逻辑 |

---

## 15. 已知取舍

| 取舍 | 原因 |
| --- | --- |
| 没有单元测试 | 按项目边界要求；用 `build` + 手动验收兜底 |
| 密码明文写在源码 | 演示站，无敏感数据；上线标注演示账号 |
| 无 XSS 清洗 | 仅本人可写内容；`react-markdown` 默认不执行 HTML |
| 无数据迁移 | 数据量小、单人维护；改结构时清空重播 |
| 无后端 | 部署简单、零成本；代价是换设备数据不同步 |
