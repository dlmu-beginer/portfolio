# AI 开发规范（AGENTS.md）

> 版本 **v2.0（极简版）**，取代 v1.0 的严格规范。
> 需求看 `PRD.md`，实现看 `TECH_DESIGN.md`，代码风格看本文件。
> 最高原则：**这是一个单人使用的展示型网站，能跑、好看、能构建，就够。**

---

## 0. 项目边界（最高优先级）

以下边界优先于任何「工程最佳实践」，违反即视为做错：

| 维度 | 本项目做法 | 明确不做 |
| --- | --- | --- |
| 后端 | 无，纯前端 | 不接 API、不建服务端、不连数据库 |
| 数据 | `localStorage` | 不同步、不多端、不迁移框架 |
| 用户 | 单一管理员 | 无注册、无找回密码、无角色权限、无用户表 |
| 登录 | 固定 `admin / 123456`，只写 `pf:isLoggedIn` | 不做哈希、PBKDF2、JWT、会话过期、token 刷新 |
| 测试 | 无 | 不写单测/E2E，不配覆盖率，不装测试框架 |
| 安全 | 演示级 | 不做 XSS 白名单、CSP、限流、审计 |
| 无障碍 | 顺手做基础项 | 不做 WCAG 合规、焦点陷阱体系、屏幕阅读器专项优化 |
| 部署 | Vercel 静态托管 | 无 SSR、无 Serverless、无 Docker |

**判断标准**：一个改动如果只是为了「将来好扩展」，默认不做。

---

## 1. 项目速览

- React 18 + TypeScript + Vite 5 + TailwindCSS 3.4 + react-router-dom 6
- Markdown：`react-markdown` + `remark-gfm`
- 图标：`lucide-react`
- 数据与登录：`src/lib/db.ts`、`src/lib/auth.ts`

```powershell
npm install
npm run dev          # 本地开发
npm run typecheck    # 类型检查
npm run build        # 构建（交付前必须成功）
npm run preview      # 预览 dist
```

交付前最低要求：**`npm run build` 通过**，页面能打开、数据能读写、控制台无报错。

---

## 2. 目录与命名

按 `TECH_DESIGN.md` §3 放置：

- 类型 → `src/types/models.ts`
- 数据读写、登录 → `src/lib/`
- 复用组件 → `src/components/{layout,ui,home,markdown,admin}/`
- 页面 → `src/pages/`，后台页面放 `pages/admin/`
- 不要新建 `services/`、`store/`、`hooks/utils/` 之类的大目录。

命名：

| 对象 | 规则 |
| --- | --- |
| 组件 / 类型 | `PascalCase`（`ProjectCard`、`Post`） |
| 函数 / 变量 | `camelCase`（`getProjectBySlug`） |
| 常量 | `UPPER_SNAKE_CASE`（`LOGIN_FLAG`） |
| 组件文件 | `PascalCase.tsx` |
| 工具文件 | `camelCase.ts` |

一个文件只做一件事；超过 250 行考虑拆分。不要为了拆而拆。

---

## 3. TypeScript

- 不用 `any`；实在不确定用 `unknown` 再收窄，或写清楚具体类型。
- 不用 `@ts-ignore`；确实需要时用 `@ts-expect-error` 并在同一行写原因。
- 公共函数写参数与返回值类型；简单组件内部可以省略。
- 类型导入用 `import type`。
- 枚举用字符串联合类型，不用 `enum`。
- 允许为了快而写少量类型断言（`as`），但不要用断言掩盖真实的 `undefined`。

```ts
export const PROJECT_STATUS = ['draft', 'published'] as const;
export type PublishStatus = (typeof PROJECT_STATUS)[number];
```

---

## 4. React

- 函数组件 + Hook，不写 class。
- Props 用 `interface XxxProps`。
- 组件内不要定义组件；需要就拆文件。
- 列表 `key` 用 `item.id`，不用下标。
- 表单用受控组件（`value` + `onChange`）。
- `useEffect` 只做副作用（监听、Canvas、定时器、滚动），并且必须写清理：

```tsx
useEffect(() => {
  const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
  document.addEventListener('keydown', onKeyDown);
  return () => document.removeEventListener('keydown', onKeyDown);
}, [onClose]);
```

- 异步/延迟逻辑注意竞态的场景很少，本项目多为同步读 localStorage，不需要复杂取消机制。
- 后台页面必须 `React.lazy`，前台首屏不加载后台与编辑器代码。
- 守卫统一用 `<RequireAuth />`，不要在每个后台页面里复制 `isLoggedIn()` 判断。

---

## 5. 样式

- 只用 Tailwind 工具类 + CSS 变量 Token，不写单独的 `.module.css`。
- 颜色只用：`bg-[var(--bg)]`、`bg-surface`、`text-[var(--text)]`、`text-slate-400`、`text-accent` 等。
- 移动优先：先写手机样式，再 `sm:` / `md:` / `lg:`。
- 圆角统一：卡片 `rounded-2xl`、控件 `rounded-[10px]`、标签 `rounded-full`。
- 所有可交互元素必须有可见的 `focus-visible` 样式（用 `.focus-ring`）。
- 动画只用 `transform` / `opacity`，`150–500ms`，不要无限循环（星空除外）。
- 必须响应 `prefers-reduced-motion`：关闭粒子动画、关闭平滑滚动。
- 后台不渲染 `StarField`。
- 不引入 UI 组件库；按钮、输入框、卡片、Modal 自己写。

---

## 6. 数据与登录

### 6.1 数据

1. 组件禁止直接调用 `localStorage`，一律走 `src/lib/db.ts` 的函数。
2. 读数据用 try/catch + 默认值，损坏数据不能让页面白屏。
3. 写数据捕获 `QuotaExceededError`，用 `alert` 或页面提示告知用户。
4. 返回集合时给拷贝（`structuredClone` 或 `[...]`/`{...}`），避免页面直接改内部对象。
5. 字段变化后，最省事的做法是清空 `pf:*` 重新播种，不写迁移代码。
6. 草稿只在后台可见；前台接口 `listPublished*` 必须过滤。
7. 派生值（阅读时长、统计）现场算，不存库。

### 6.2 登录

- 固定账号常量放 `src/lib/auth.ts`：`admin` / `123456`。
- 登录成功只做一件事：`localStorage.setItem('pf:isLoggedIn', 'true')`。
- 退出登录：`removeItem('pf:isLoggedIn')` 后跳 `/admin/login`。
- **不做**密码加密、会话过期、记住我、多账号。
- 登录页必须显示「演示账号：admin / 123456」。
- 不要把 `123456` 当作任何真实服务的密码；本站数据本身也不放敏感信息。

---

## 7. 内容与文案

- 界面文案中文，语气简洁，不用营销腔。
- 日期展示 `YYYY-MM-DD`，存储用 ISO 字符串。
- 空状态要有引导：如「还没有项目，去新建一个」并提供按钮。
- 错误提示写人话：「该 slug 已被使用」，不要抛英文堆栈给用户。
- 图片必须有 `alt`；纯装饰元素 `aria-hidden`。这是顺手做的事，不额外投入。

---

## 8. 依赖与性能

引入新依赖前先问：能不能用现有代码或原生 API 解决？

- **禁止**：Ant Design、MUI、Chakra、Element、Bootstrap、Redux、MobX、jQuery、Framer Motion、任何测试框架。
- **允许**：`lucide-react`、`react-markdown` 生态、`@tailwindcss/typography`（需排版时）。
- 图片必须走 `SmartImage`（懒加载 + 失败占位 + 固定比例）。
- 星空：DPR 上限 2、手机粒子 ≤ 40、页面隐藏暂停、卸载清理 `requestAnimationFrame`。
- 前台首屏 JS（gzip）尽量 < 250KB；超标先查是否误把后台打进了主包。

---

## 9. 不要做的事（过度开发清单）

| ❌ 不要 | ✅ 应该 |
| --- | --- |
| 加后端 / 数据库 / API 联调 | 继续用 `lib/db.ts` |
| 加注册、找回密码、权限角色 | 固定单账号 |
| 引入 PBKDF2 / JWT / 加密 | 明文比较 + `isLoggedIn` 标记 |
| 加 Redux / React Query / Zustand | `useState` + `useEffect` |
| 引入重型 UI 库 | 自研 Tailwind 组件 |
| 写单元测试 / 配 CI 测试 | 手动验收 + `build` 通过 |
| 加 XSS 清洗管线 / CSP | `react-markdown` 默认行为即可 |
| 加数据迁移、版本号、Schema 校验库 | 清空 `pf:*` 重新播种 |
| 大范围重构、全量格式化 | 只改与任务相关的文件 |
| 把页面拆成十几个抽象层 | 保持 2–3 层，能读就行 |
| `div` 加 `onClick` 当按钮 | 用 `<button>` / `<Link>` |
| 用数组下标当 `key` | 用 `item.id` |
| 无清理的定时器 / 监听 / RAF | `return () => cleanup()` |

---

## 10. 完成定义

一个功能做完，至少满足：

- [ ] `npm run build` 成功，无 TypeScript 报错。
- [ ] 浏览器控制台无红色报错（图片 404 等网络警告可接受）。
- [ ] 320px / 768px / 1280px 三档无横向滚动、无遮挡。
- [ ] 数据刷新后仍在（localStorage 写入正确）。
- [ ] 空状态、错误提示有人话。
- [ ] 新增页面已挂到路由；后台页面已懒加载。
- [ ] 没有把密码、token 打到控制台。

交付说明写清：改了什么、怎么验证的、还有什么没做。三句话以内即可，不要长篇报告。

---

## 11. 变更记录

| 日期 | 版本 | 变更 |
| --- | --- | --- |
| 2026-10-20 | v1.0 | 初版：严格工程规范（已废弃） |
| 2026-10-20 | v2.0 | 按个人站极简原则收敛：固定账号、纯 localStorage、无测试、无安全加固体系 |
