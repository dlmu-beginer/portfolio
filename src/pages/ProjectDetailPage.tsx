import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { getProjectBySlug } from '../lib/db';
import { formatDate } from '../lib/date';
import { buttonStyles } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SmartImage } from '../components/ui/SmartImage';
import { MarkdownView } from '../components/markdown/MarkdownView';
import { NotFoundPage } from './NotFoundPage';

export function ProjectDetailPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) return <NotFoundPage />;

  const range = [project.startDate?.slice(0, 7), project.endDate?.slice(0, 7)]
    .filter(Boolean)
    .join(' — ');

  return (
    <article className="px-5 pb-24 pt-28 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/#projects"
          className="focus-ring inline-flex items-center gap-1.5 rounded text-xs text-slate-500 transition hover:text-white"
        >
          <ArrowLeft size={14} />
          返回项目列表
        </Link>

        <p className="mt-9 font-mono text-[11px] tracking-[0.3em] text-accent">// CASE STUDY</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-slate-400">{project.summary}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500">
          {range ? <span className="font-mono">{range}</span> : null}
          <span className="font-mono">{formatDate(project.updatedAt)} 更新</span>
          <span className="h-3 w-px bg-white/10" aria-hidden="true" />
          {project.techStack.map((tech) => (
            <span key={tech} className="rounded-full border border-white/10 px-2.5 py-0.5">
              {tech}
            </span>
          ))}
        </div>

        {project.coverUrl ? (
          <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-surface-2">
            <SmartImage
              src={project.coverUrl}
              alt={project.title}
              fallbackText={project.title.slice(0, 1)}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="mt-10">
          <MarkdownView content={project.content} />
        </div>

        {project.tags.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3 border-t border-white/[0.06] pt-8">
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles('primary', 'md')}
            >
              在线预览
              <ExternalLink size={15} />
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles('secondary', 'md')}
            >
              源代码
              <Github size={15} />
            </a>
          ) : null}
          <Link
            to="/#contact"
            className={buttonStyles('ghost', 'md', 'ml-auto text-slate-400')}
          >
            聊聊类似的项目
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
