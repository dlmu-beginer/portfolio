import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
  type LucideIcon,
} from 'lucide-react';
import type { Profile } from '../../types/models';
import { estimateYearsOfExperience } from '../../lib/date';
import { buttonStyles } from '../ui/Button';
import { SmartImage } from '../ui/SmartImage';

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  github: Github,
  email: Mail,
  juejin: BookOpen,
  x: Twitter,
  twitter: Twitter,
  linkedin: Linkedin,
  website: Globe,
};

interface HeroProps {
  profile: Profile;
  projectCount: number;
}

export function Hero({ profile, projectCount }: HeroProps): JSX.Element {
  const years = estimateYearsOfExperience(
    profile.timeline.filter((item) => item.type === 'work').map((item) => item.period),
  );

  return (
    <section id="home" className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8 md:pb-28 md:pt-36">
      <div className="grid-overlay pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs text-emerald-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            可接新的机会
          </span>

          <p className="mt-8 font-mono text-[11px] tracking-[0.32em] text-slate-500">HELLO, I'M</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {profile.name || '你的名字'}
            <span className="text-accent">.</span>
          </h1>
          <p className="text-gradient mt-5 text-xl font-medium sm:text-2xl">
            {profile.headline || '全栈工程师'}
          </p>
          <p className="mt-5 max-w-xl text-[15px] leading-8 text-slate-400">
            {profile.tagline || '在这里写一句能让人记住你的话。'}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/#projects" className={buttonStyles('primary', 'lg')}>
              查看项目
              <ArrowRight size={16} />
            </Link>
            <Link to="/#contact" className={buttonStyles('secondary', 'lg')}>
              联系我
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              {profile.socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform] ?? Globe;
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:border-accent/40 hover:text-white"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
            <span className="h-px w-8 bg-white/10" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin size={13} />
              {profile.location || '地球某处'}
            </span>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-sm items-center justify-center lg:max-w-none">
          <div className="absolute h-64 w-64 rounded-full bg-accent/25 blur-[90px]" aria-hidden="true" />
          <div className="absolute right-4 top-0 h-40 w-40 rounded-full bg-accent-2/20 blur-[70px]" aria-hidden="true" />

          <div className="relative">
            <div
              className="absolute -inset-5 rounded-[2.5rem] border border-white/[0.06]"
              aria-hidden="true"
            />
            <div
              className="absolute -inset-9 rounded-[2.9rem] border border-dashed border-white/[0.05]"
              aria-hidden="true"
            />

            <div className="relative h-60 w-60 overflow-hidden rounded-[2rem] border border-white/10 bg-surface p-2 shadow-2xl sm:h-72 sm:w-72">
              <SmartImage
                src={profile.avatarUrl}
                alt={`${profile.name || '我'} 的头像`}
                fallbackText={(profile.name || 'P').slice(0, 1)}
                fallbackClassName="text-7xl"
                className="h-full w-full rounded-[1.5rem] object-cover"
              />
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-t from-[#0B0F1A]/40 via-transparent to-transparent" />
            </div>

            {years ? (
              <div className="absolute -left-8 top-8 hidden rounded-xl border border-white/10 bg-[#121826]/90 px-4 py-3 backdrop-blur sm:block">
                <p className="font-mono text-[9px] tracking-[0.2em] text-slate-500">EXPERIENCE</p>
                <p className="mt-1 text-sm text-slate-100">{years} 年+</p>
              </div>
            ) : null}
            {projectCount > 0 ? (
              <div className="absolute -right-6 bottom-10 hidden rounded-xl border border-white/10 bg-[#121826]/90 px-4 py-3 backdrop-blur sm:block">
                <p className="font-mono text-[9px] tracking-[0.2em] text-slate-500">SHIPPED</p>
                <p className="mt-1 text-sm text-slate-100">{projectCount} 个项目</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
