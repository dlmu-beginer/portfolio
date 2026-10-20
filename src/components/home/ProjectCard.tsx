import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import type { Project } from '../../types/models';
import { Badge } from '../ui/Badge';
import { SmartImage } from '../ui/SmartImage';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps): JSX.Element {
  const year = project.startDate?.slice(0, 4);

  return (
    <article className="group card-surface flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_24px_70px_-40px_rgba(108,140,255,0.6)]">
      <Link
        to={`/projects/${project.slug}`}
        className="focus-ring relative block aspect-[16/10] overflow-hidden bg-surface-2"
      >
        <SmartImage
          src={project.coverUrl}
          alt={project.title}
          fallbackText={project.title.slice(0, 1)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/85 via-[#0B0F1A]/10 to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          {project.featured ? <Badge tone="accent">精选</Badge> : null}
        </div>
        {year ? (
          <span className="absolute bottom-4 left-4 font-mono text-[11px] tracking-widest text-slate-300">
            {year}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold leading-snug text-white">
          <Link
            to={`/projects/${project.slug}`}
            className="focus-ring rounded transition hover:text-accent"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{project.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-6">
          <div className="flex items-center gap-3 text-slate-500">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} 在线预览`}
                className="focus-ring rounded transition hover:text-white"
              >
                <ExternalLink size={16} />
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} 源码`}
                className="focus-ring rounded transition hover:text-white"
              >
                <Github size={16} />
              </a>
            ) : null}
          </div>
          <Link
            to={`/projects/${project.slug}`}
            className="focus-ring inline-flex items-center gap-1 rounded text-xs text-slate-400 transition hover:text-accent"
          >
            查看详情
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
