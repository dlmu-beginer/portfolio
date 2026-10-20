import {
  Atom,
  Code2,
  Container,
  Database,
  Figma,
  GitBranch,
  Globe,
  Server,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { Skill, SkillCategory } from '../../types/models';
import { Section } from '../ui/Section';
import { ProgressBar } from '../ui/ProgressBar';

const ICONS: Record<string, LucideIcon> = {
  react: Atom,
  typescript: Code2,
  tailwind: Wind,
  vite: Zap,
  next: Globe,
  node: Server,
  database: Database,
  figma: Figma,
  docker: Container,
  git: GitBranch,
};

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend: '前端',
  backend: '后端',
  design: '设计',
  tool: '工具',
  other: '其他',
};

const CATEGORY_ORDER: SkillCategory[] = ['frontend', 'backend', 'design', 'tool', 'other'];

interface SkillCardProps {
  skill: Skill;
}

function SkillCard({ skill }: SkillCardProps): JSX.Element {
  const Icon = ICONS[skill.icon] ?? Code2;
  const level = Math.min(100, Math.max(0, skill.level));

  return (
    <div className="group card-surface p-5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/30">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-accent transition group-hover:border-accent/40 group-hover:text-accent-2">
          <Icon size={18} />
        </span>
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-100">{skill.name}</p>
        <span className="font-mono text-[11px] text-slate-500">{level}%</span>
      </div>
      <ProgressBar value={level} className="mt-4" />
    </div>
  );
}

interface SkillsProps {
  skills: Skill[];
}

export function Skills({ skills }: SkillsProps): JSX.Element {
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: skills.filter((skill) => skill.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <Section
      id="skills"
      label="// 02 SKILLS"
      title="技能"
      description="日常使用的技术栈。熟练度不是绝对标准，但能说明我把时间花在了哪里。"
    >
      {groups.length > 0 ? (
        <div className="space-y-12">
          {groups.map((group) => (
            <div key={group.category}>
              <div className="mb-5 flex items-center gap-4">
                <h3 className="text-sm font-medium tracking-wide text-slate-200">
                  {CATEGORY_LABELS[group.category]}
                </h3>
                <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                <span className="font-mono text-[10px] text-slate-600">
                  {String(group.items.length).padStart(2, '0')} 项
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-surface flex h-40 items-center justify-center text-sm text-slate-500">
          还没有添加技能
        </div>
      )}
    </Section>
  );
}
