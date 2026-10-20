import { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { getProfile } from '../../lib/db';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function Footer(): JSX.Element {
  const [profile] = useState(() => getProfile());
  const reduced = usePrefersReducedMotion();
  const year = new Date().getFullYear();

  const handleTop = () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/[0.06] px-5 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-300">
            {profile.name || 'Portfolio'}
            <span className="mx-2 text-slate-600">/</span>
            Portfolio
          </p>
          <p className="mt-1.5 text-xs text-slate-500">
            © {year} · 用 React、Vite 与一点星光搭建
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          {profile.socials.slice(0, 3).map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded transition hover:text-white"
            >
              {social.label}
            </a>
          ))}
          <button
            type="button"
            onClick={handleTop}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-slate-400 transition hover:border-white/25 hover:text-white"
          >
            回到顶部
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
