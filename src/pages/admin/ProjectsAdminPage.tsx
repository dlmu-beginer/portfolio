import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import type { Project, PublishStatus } from '../../types/models';
import { deleteProject, listProjects } from '../../lib/db';
import { formatDate } from '../../lib/date';
import { Badge } from '../../components/ui/Badge';
import { SmartImage } from '../../components/ui/SmartImage';
import { buttonStyles } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';

type StatusFilter = 'all' | PublishStatus;

const STATUS_FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'published', label: '已发布' },
  { value: 'draft', label: '草稿' },
];

export function ProjectsAdminPage(): JSX.Element {
  const [projects, setProjects] = useState<Project[]>(listProjects);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const { showToast } = useToast();

  const keyword = query.trim().toLowerCase();
  const filtered = projects.filter((project) => {
    if (status !== 'all' && project.status !== status) return false;
    if (!keyword) return true;
    return (
      project.title.toLowerCase().includes(keyword) ||
      project.slug.toLowerCase().includes(keyword) ||
      project.tags.some((tag) => tag.toLowerCase().includes(keyword))
    );
  });

  const handleDelete = (project: Project): void => {
    if (!window.confirm(`确定删除「${project.title}」？此操作不可撤销。`)) return;
    deleteProject(project.id);
    setProjects(listProjects());
    showToast('已删除');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.28em] text-accent">// PROJECTS</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">项目管理</h2>
          <p className="mt-2 text-sm text-slate-400">
            共 {projects.length} 个项目 · {projects.filter((item) => item.status === 'published').length}{' '}
            个已发布
          </p>
        </div>
        <Link to="/admin/projects/new" className={buttonStyles('primary', 'md')}>
          <Plus size={15} />
          新建项目
        </Link>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-white/[0.06] p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索标题、slug 或标签"
              aria-label="搜索项目"
              className="pl-9"
            />
          </div>
          <div className="flex gap-1.5">
            {STATUS_FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setStatus(item.value)}
                className={
                  status === item.value
                    ? 'focus-ring rounded-full border border-accent/40 bg-accent/15 px-3.5 py-1.5 text-xs text-white'
                    : 'focus-ring rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-slate-400 transition hover:border-white/25 hover:text-white'
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="divide-y divide-white/[0.06]">
            {filtered.map((project) => (
              <div key={project.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-surface-2">
                    <SmartImage
                      src={project.coverUrl}
                      alt={project.title}
                      fallbackText={project.title.slice(0, 1)}
                      fallbackClassName="text-sm"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium text-slate-100">{project.title}</p>
                      <Badge tone={project.status === 'published' ? 'success' : 'default'}>
                        {project.status === 'published' ? '已发布' : '草稿'}
                      </Badge>
                      {project.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] text-[#B9C7FF]">
                          <Star size={10} />
                          精选
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 truncate text-[11px] text-slate-500">
                      /{project.slug} · 更新于 {formatDate(project.updatedAt)}
                    </p>
                    {project.tags.length > 0 ? (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                  <Link
                    to={`/admin/projects/${project.id}/edit`}
                    className={buttonStyles('secondary', 'sm')}
                  >
                    <Pencil size={13} />
                    编辑
                  </Link>
                  {project.status === 'published' ? (
                    <Link
                      to={`/projects/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonStyles('ghost', 'sm')}
                    >
                      <ExternalLink size={13} />
                      预览
                    </Link>
                  ) : (
                    <span className="inline-flex h-9 items-center gap-1.5 rounded-[10px] px-4 text-sm text-slate-600">
                      <ExternalLink size={13} />
                      预览
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(project)}
                    aria-label={`删除${project.title}`}
                    className="focus-ring flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/10 text-slate-500 transition hover:border-rose-400/30 hover:text-rose-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
            {projects.length === 0 ? (
              <>
                <p className="text-sm text-slate-400">还没有项目，去新建一个。</p>
                <Link to="/admin/projects/new" className={buttonStyles('primary', 'sm')}>
                  <Plus size={14} />
                  新建项目
                </Link>
              </>
            ) : (
              <p className="text-sm text-slate-500">没有匹配的项目，换个关键词试试。</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
