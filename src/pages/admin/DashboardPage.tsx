import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  FolderKanban,
  Mail,
  PenLine,
  Plus,
  Send,
  UserRound,
} from 'lucide-react';
import { listMessages, listPosts, listProjects } from '../../lib/db';
import { formatDate } from '../../lib/date';
import { StatCard } from '../../components/admin/StatCard';
import { Badge } from '../../components/ui/Badge';
import { buttonStyles } from '../../components/ui/Button';

interface RecentItem {
  id: string;
  type: '项目' | '文章';
  title: string;
  updatedAt: string;
  to: string;
}

export function DashboardPage(): JSX.Element {
  const projects = listProjects();
  const posts = listPosts();
  const messages = listMessages();

  const publishedProjects = projects.filter((item) => item.status === 'published').length;
  const publishedPosts = posts.filter((item) => item.status === 'published').length;

  const recent: RecentItem[] = [
    ...projects.map<RecentItem>((project) => ({
      id: project.id,
      type: '项目',
      title: project.title,
      updatedAt: project.updatedAt,
      to: `/admin/projects/${project.id}/edit`,
    })),
    ...posts.map<RecentItem>((post) => ({
      id: post.id,
      type: '文章',
      title: post.title,
      updatedAt: post.updatedAt,
      to: `/admin/posts/${post.id}/edit`,
    })),
  ]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.28em] text-accent">// OVERVIEW</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">仪表盘</h2>
          <p className="mt-2 text-sm text-slate-400">内容与数据都存在本机浏览器，改动后前台刷新即可看到。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/projects/new" className={buttonStyles('secondary', 'sm')}>
            <Plus size={14} />
            新建项目
          </Link>
          <Link to="/admin/posts/new" className={buttonStyles('primary', 'sm')}>
            <Plus size={14} />
            新建文章
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="项目总数" value={projects.length} icon={FolderKanban} hint="含草稿" />
        <StatCard
          label="已发布项目"
          value={publishedProjects}
          icon={CheckCircle2}
          hint="前台可见"
        />
        <StatCard label="文章总数" value={posts.length} icon={FileText} hint="含草稿" />
        <StatCard label="已发布文章" value={publishedPosts} icon={Send} hint="前台可见" />
        <StatCard label="留言总数" value={messages.length} icon={Mail} hint="来自前台联系表单" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="card-surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <h3 className="text-sm font-medium text-slate-200">最近更新</h3>
            <span className="font-mono text-[10px] tracking-widest text-slate-600">RECENT</span>
          </div>
          {recent.length > 0 ? (
            <div className="divide-y divide-white/[0.06]">
              {recent.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  to={item.to}
                  className="focus-ring flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-white/[0.03]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge tone={item.type === '项目' ? 'accent' : 'default'}>{item.type}</Badge>
                      <p className="truncate text-sm text-slate-200">{item.title}</p>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600">
                      更新于 {formatDate(item.updatedAt)}
                    </p>
                  </div>
                  <ArrowUpRight size={14} className="shrink-0 text-slate-600" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="px-4 py-10 text-center text-sm text-slate-500">
              还没有内容，先新建一个项目或文章。
            </p>
          )}
        </section>

        <section className="card-surface p-5">
          <h3 className="text-sm font-medium text-slate-200">快捷入口</h3>
          <div className="mt-4 space-y-2">
            <Link
              to="/admin/projects/new"
              className="focus-ring flex items-center gap-3 rounded-[10px] border border-white/10 px-3 py-2.5 text-sm text-slate-300 transition hover:border-white/25 hover:text-white"
            >
              <FolderKanban size={15} className="text-accent" />
              新建项目
            </Link>
            <Link
              to="/admin/posts/new"
              className="focus-ring flex items-center gap-3 rounded-[10px] border border-white/10 px-3 py-2.5 text-sm text-slate-300 transition hover:border-white/25 hover:text-white"
            >
              <PenLine size={15} className="text-accent" />
              写一篇文章
            </Link>
            <Link
              to="/admin/profile"
              className="focus-ring flex items-center gap-3 rounded-[10px] border border-white/10 px-3 py-2.5 text-sm text-slate-300 transition hover:border-white/25 hover:text-white"
            >
              <UserRound size={15} className="text-accent" />
              编辑个人信息
            </Link>
          </div>
          <p className="mt-5 border-t border-white/[0.06] pt-4 text-[11px] leading-5 text-slate-600">
            提示：前台只展示「已发布」的内容，草稿只在后台可见。
          </p>
        </section>
      </div>
    </div>
  );
}
