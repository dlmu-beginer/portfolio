import { Briefcase, Mail, MapPin, Quote } from 'lucide-react';
import type { Profile, TimelineType } from '../../types/models';
import { Section } from '../ui/Section';

const TYPE_LABELS: Record<TimelineType, string> = {
  work: '工作',
  education: '教育',
  award: '荣誉',
  other: '其他',
};

interface AboutTimelineProps {
  profile: Profile;
}

export function AboutTimeline({ profile }: AboutTimelineProps): JSX.Element {
  return (
    <Section
      id="about"
      label="// 01 ABOUT"
      title="关于我"
      description="写代码，也写一点关于代码的文字。相信好的界面是克制的、清晰的，并且足够快。"
    >
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div className="space-y-5">
          <div className="card-surface relative overflow-hidden p-6 sm:p-7">
            <Quote
              size={72}
              className="pointer-events-none absolute -right-2 -top-3 text-white/[0.04]"
              aria-hidden="true"
            />
            <p className="whitespace-pre-line text-[15px] leading-8 text-slate-300">
              {profile.bio || '还没有填写个人介绍。登录后台即可补充。'}
            </p>
          </div>

          <div className="card-surface divide-y divide-white/[0.06]">
            <div className="flex items-center gap-3 px-6 py-4">
              <MapPin size={15} className="text-accent" />
              <span className="text-xs text-slate-500">所在城市</span>
              <span className="ml-auto text-sm text-slate-200">{profile.location || '—'}</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-4">
              <Mail size={15} className="text-accent" />
              <span className="text-xs text-slate-500">邮箱</span>
              <a
                href={`mailto:${profile.email}`}
                className="focus-ring ml-auto truncate rounded text-sm text-slate-200 transition hover:text-accent"
              >
                {profile.email || '—'}
              </a>
            </div>
            <div className="flex items-center gap-3 px-6 py-4">
              <Briefcase size={15} className="text-accent" />
              <span className="text-xs text-slate-500">当前状态</span>
              <span className="ml-auto text-sm text-slate-200">开放机会</span>
            </div>
          </div>
        </div>

        <div>
          {profile.timeline.length > 0 ? (
            <ol className="relative ml-1.5 space-y-9 border-l border-white/10 pl-8">
              {profile.timeline.map((item) => (
                <li key={item.id} className="relative">
                  <span
                    className="absolute -left-[38px] top-1.5 h-3 w-3 rounded-full border-2 border-[#0B0F1A] bg-accent shadow-[0_0_16px_rgba(108,140,255,0.85)]"
                    aria-hidden="true"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[11px] tracking-[0.1em] text-slate-500">
                      {item.period}
                    </span>
                    <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] text-slate-400">
                      {TYPE_LABELS[item.type]}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-medium text-white">{item.title}</h3>
                  <p className="mt-0.5 text-sm text-accent">{item.organization}</p>
                  {item.description ? (
                    <p className="mt-2 text-sm leading-7 text-slate-400">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : (
            <div className="card-surface flex h-40 items-center justify-center text-sm text-slate-500">
              暂无经历记录
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
