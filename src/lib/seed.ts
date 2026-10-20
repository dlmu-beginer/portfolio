import type { Post, Profile, Project } from '../types/models';

export const seedProfile: Profile = {
  name: '陈亦舟',
  headline: '全栈工程师 · 交互与性能',
  tagline: '把复杂的产品逻辑，做成干净、快速、让人愿意多停留一会儿的界面。',
  bio: '五年全栈开发经验，主要活跃在 React 生态。喜欢把设计稿还原到像素级，也喜欢钻进 Performance 面板里找那 200ms。\n\n工作之外写博客、拍照、跑步，偶尔给开源项目提 PR。',
  avatarUrl: '',
  location: '上海 · 徐汇',
  email: 'hello@chenyizhou.dev',
  socials: [
    { id: 's1', platform: 'github', label: 'GitHub', url: 'https://github.com/' },
    { id: 's2', platform: 'juejin', label: '掘金', url: 'https://juejin.cn/' },
    { id: 's3', platform: 'email', label: 'Email', url: 'mailto:hello@chenyizhou.dev' },
  ],
  timeline: [
    {
      id: 't1',
      period: '2023.07 — 至今',
      title: '高级前端工程师',
      organization: 'Aurora Tech',
      description: '负责数据可视化平台的前端架构，带 3 人小组，推动组件库与性能规范落地。',
      type: 'work',
    },
    {
      id: 't2',
      period: '2021.09 — 2023.06',
      title: '前端工程师',
      organization: 'Nebula Labs',
      description: '从 0 到 1 搭建设计系统，服务 6 条业务线；把首屏时间压到 1.2s 以内。',
      type: 'work',
    },
    {
      id: 't3',
      period: '2017.09 — 2021.06',
      title: '计算机科学与技术 · 本科',
      organization: '华东理工大学',
      description: '校 ACM 队成员，毕业设计是 WebGL 数据可视化。',
      type: 'education',
    },
  ],
  skills: [
    { id: 'k1', name: 'React', icon: 'react', category: 'frontend', level: 92 },
    { id: 'k2', name: 'TypeScript', icon: 'typescript', category: 'frontend', level: 90 },
    { id: 'k3', name: 'Tailwind CSS', icon: 'tailwind', category: 'frontend', level: 88 },
    { id: 'k4', name: 'Vite', icon: 'vite', category: 'frontend', level: 86 },
    { id: 'k5', name: 'Next.js', icon: 'next', category: 'frontend', level: 84 },
    { id: 'k6', name: 'Node.js', icon: 'node', category: 'backend', level: 82 },
    { id: 'k7', name: 'PostgreSQL', icon: 'database', category: 'backend', level: 76 },
    { id: 'k8', name: 'Figma', icon: 'figma', category: 'design', level: 72 },
    { id: 'k9', name: 'Docker', icon: 'docker', category: 'tool', level: 70 },
    { id: 'k10', name: 'Git', icon: 'git', category: 'tool', level: 88 },
  ],
};

export const seedProjects: Project[] = [
  {
    id: 'p1',
    slug: 'aurora-dashboard',
    title: 'Aurora 数据可视化平台',
    summary: '面向运营团队的可配置指标看板，覆盖 8 个业务团队，首屏渲染 0.9s。',
    coverUrl: '/covers/aurora.svg',
    tags: ['数据可视化', '中后台', '性能'],
    techStack: ['React', 'TypeScript', 'Web Worker', 'D3'],
    demoUrl: 'https://example.com/aurora',
    repoUrl: 'https://github.com/',
    status: 'published',
    featured: true,
    order: 1,
    startDate: '2024-03-01',
    endDate: '2024-11-30',
    createdAt: '2024-12-10T08:00:00.000Z',
    updatedAt: '2026-09-18T08:00:00.000Z',
    content: `## 项目背景

公司内部的指标看板分散在 6 个系统里，运营每次周报都要手动截图拼接。Aurora 的目标是把「取数、看数、分享」收敛到一个页面。

## 我做了什么

- 设计并实现基于 **React + TypeScript** 的可配置看板，支持 12 种图表类型
- 用 Web Worker 处理十万级数据点的聚合，首屏渲染从 4.2s 降到 0.9s
- 抽象出图表配置 DSL，业务同学改配置即可上线新看板

## 关键代码

~~~ts
const aggregate = (rows: Row[], dimension: string) =>
  rows.reduce<Record<string, number>>((acc, row) => {
    acc[row[dimension]] = (acc[row[dimension]] ?? 0) + row.value;
    return acc;
  }, {});
~~~

## 结果

上线后覆盖 8 个业务团队，周报制作时间从 3 小时缩短到 20 分钟。`,
  },
  {
    id: 'p2',
    slug: 'nebula-ui',
    title: 'Nebula 组件库',
    summary: '一套轻量的 React 组件与设计 Token，服务 6 条业务线，包体积仅 38KB。',
    coverUrl: '/covers/nebula.svg',
    tags: ['开源', '设计系统'],
    techStack: ['React', 'TypeScript', 'Rollup', 'Storybook'],
    repoUrl: 'https://github.com/',
    status: 'published',
    featured: false,
    order: 2,
    startDate: '2022-05-01',
    endDate: '2023-04-30',
    createdAt: '2023-05-06T08:00:00.000Z',
    updatedAt: '2026-06-02T08:00:00.000Z',
    content: `## 为什么再造一个组件库

业务线各自维护弹窗和表单，交互不一致，改一处要改六处。Nebula 只做「真正复用」的 18 个组件，其余交给业务自建。

## 设计原则

1. **可组合**：组件只负责结构，样式通过 Token 注入
2. **可访问**：默认键盘可达，焦点样式内置
3. **可摇树**：每个组件独立入口，按需引入

## 成果

- 6 条业务线接入，重复代码减少约 40%
- 组件平均包体积 2.1KB，整包 gzip 38KB
- Storybook 上沉淀 60+ 个可交互示例`,
  },
  {
    id: 'p3',
    slug: 'portfolio-2026',
    title: 'Portfolio 2026',
    summary: '你正在看的这个站点：深色星空、毛玻璃导航、纯前端内容管理。',
    coverUrl: '/covers/portfolio.svg',
    tags: ['个人项目', '设计'],
    techStack: ['React', 'Vite', 'Tailwind CSS', 'Canvas'],
    repoUrl: 'https://github.com/',
    status: 'draft',
    featured: false,
    order: 3,
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-19T08:00:00.000Z',
    content: `## 目标

做一个能长期维护的个人主页：好看、够快、不需要服务器。

## 技术点

- Canvas 绘制星空，移动端自动降级
- localStorage 充当数据层，后台直接在浏览器里改内容
- 全站深色 Token，统一圆角与留白`,
  },
];

export const seedPosts: Post[] = [
  {
    id: 'a1',
    slug: 'canvas-starfield',
    title: '用 Canvas 写一片会呼吸的星空',
    excerpt: '从粒子数量、DPR 到 prefers-reduced-motion，聊聊怎么让背景好看又不拖慢页面。',
    coverUrl: '/covers/starfield.svg',
    tags: ['Canvas', '性能'],
    status: 'published',
    publishedAt: '2026-09-28T08:00:00.000Z',
    createdAt: '2026-09-26T08:00:00.000Z',
    updatedAt: '2026-09-28T08:00:00.000Z',
    content: `## 先确定预算

星空是背景，不是主角。我的预算是：桌面 140 个粒子，手机不超过 40 个，任何情况下不产生超过 50ms 的长任务。

## 粒子怎么画

每个粒子只需要几个属性：位置、半径、漂移速度、闪烁相位。

~~~ts
interface Star {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
}
~~~

每帧清屏后逐点绘制，透明度用正弦函数做呼吸：

~~~ts
const alpha = 0.35 + Math.sin(time * 0.001 + star.phase) * 0.25;
ctx.fillStyle = 'rgba(230, 234, 242, ' + alpha + ')';
ctx.beginPath();
ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
ctx.fill();
~~~

## 三个容易踩的坑

1. 忘记乘 DPR，Retina 屏上粒子会糊成一团
2. 用 \`shadowBlur\` 做光晕，帧率直接掉一半
3. 页面切到后台还在跑动画，笔记本风扇起飞

## 降级策略

- 手机端减少粒子、关闭鼠标视差
- 系统开启「减少动态效果」时只画一帧
- 监听 \`visibilitychange\`，隐藏时暂停

最后一点：记得在组件卸载时 \`cancelAnimationFrame\`，否则路由切换后旧循环还在跑。`,
  },
  {
    id: 'a2',
    slug: 'localstorage-as-database',
    title: 'localStorage 也能当数据库用',
    excerpt: '单人项目不需要后端。用一层薄封装把 localStorage 变成可维护的数据层。',
    coverUrl: '/covers/storage.svg',
    tags: ['工程实践', 'React'],
    status: 'published',
    publishedAt: '2026-08-16T08:00:00.000Z',
    createdAt: '2026-08-14T08:00:00.000Z',
    updatedAt: '2026-08-16T08:00:00.000Z',
    content: `## 适用场景

只有你一个人写内容、只有一台设备维护、数据量在几 MB 以内——这种项目引入后端纯属自找麻烦。

## 分层

关键不是「要不要用 localStorage」，而是**不要让组件直接碰它**。所有读写集中在 \`lib/db.ts\`：

| 层 | 职责 |
| --- | --- |
| 组件 | 表单、展示、交互 |
| db.ts | 序列化、CRUD、排序、种子数据 |
| localStorage | 纯字符串存储 |

## 两个细节

**读取要兜底**。用户可能手动改坏 JSON，解析失败时返回默认值，页面不能白屏。

**写入要捕获配额异常**。\`QuotaExceededError\` 是真实存在的，尤其是存了 base64 图片之后。

~~~ts
try {
  localStorage.setItem(key, JSON.stringify(value));
} catch (error) {
  alert('本地存储空间不足');
}
~~~

## 代价

换电脑数据不同步，清缓存就没了。所以我习惯把重要内容同时留一份 Markdown 备份。`,
  },
  {
    id: 'a3',
    slug: 'dark-ui-hierarchy',
    title: '深色界面里的留白与层级',
    excerpt: '深色不是把背景调黑。明度差、描边、光晕，才是层次的来源。',
    coverUrl: '/covers/darkui.svg',
    tags: ['设计', 'CSS'],
    status: 'published',
    publishedAt: '2026-07-05T08:00:00.000Z',
    createdAt: '2026-07-03T08:00:00.000Z',
    updatedAt: '2026-07-05T08:00:00.000Z',
    content: `## 背景不要纯黑

\`#000000\` 会让所有阴影失效。我用 \`#0B0F1A\`，带一点蓝，卡片用 \`#121826\`，两者只差一点明度，但层级立刻出来了。

## 三层就够

1. 页面底色
2. 卡片 / 面板
3. 输入框 / 悬浮态

再多的层级会让界面变脏。

## 描边比阴影好用

深色下阴影几乎看不见，1px 的 \`rgba(255,255,255,0.08)\` 描边反而更清晰。需要强调时把描边换成主色的 30%。

## 文字对比度

正文 \`#E6EAF2\`，次要信息 \`#94A3B8\`。不要用 \`#64748B\` 写正文，它在暗背景上读起来很累。

## 留白

区块之间 \`py-24\`，卡片内边距 \`p-6\`，标题和正文之间至少 \`16px\`。深色界面本来就容易显得拥挤，留白是最便宜的高级感。`,
  },
];
