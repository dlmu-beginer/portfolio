import { useMemo, useState } from 'react';
import type { Project } from '../../types/models';
import { cn } from '../../lib/cn';
import { Section } from '../ui/Section';
import { ProjectCard } from './ProjectCard';

interface ProjectsSectionProps {
  projects: Project[];
}

const ALL = '全部';

export function ProjectsSection({ projects }: ProjectsSectionProps): JSX.Element {
  const [activeTag, setActiveTag] = useState(ALL);
  const tags = useMemo(
    () => [ALL, ...Array.from(new Set(projects.flatMap((project) => project.tags)))],
    [projects],
  );
  const visible =
    activeTag === ALL ? projects : projects.filter((project) => project.tags.includes(activeTag));

  return (
    <Section
      id="projects"
      label="// 03 PROJECTS"
      title="项目"
      description="挑了几个能说明问题的项目。点开可以看到背景、做法和结果。"
    >
      {projects.length > 0 ? (
        <>
          <div className="mb-8 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={cn(
                  'focus-ring rounded-full border px-4 py-1.5 text-xs transition',
                  activeTag === tag
                    ? 'border-accent/40 bg-accent/15 text-white'
                    : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white',
                )}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="card-surface mt-6 flex h-32 items-center justify-center text-sm text-slate-500">
              这个标签下还没有项目
            </div>
          ) : null}
        </>
      ) : (
        <div className="card-surface flex h-40 items-center justify-center text-sm text-slate-500">
          项目正在整理中，敬请期待
        </div>
      )}
    </Section>
  );
}
