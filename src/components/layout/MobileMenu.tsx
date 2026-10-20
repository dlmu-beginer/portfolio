import { Link } from 'react-router-dom';
import { X, ArrowUpRight } from 'lucide-react';
import type { Profile } from '../../types/models';
import { cn } from '../../lib/cn';
import { NAV_ITEMS } from './navItems';

interface MobileMenuProps {
  open: boolean;
  active: string;
  profile: Profile;
  onClose: () => void;
}

export function MobileMenu({ open, active, profile, onClose }: MobileMenuProps): JSX.Element {
  return (
    <div
      id="mobile-menu"
      aria-hidden={!open}
      className={cn('fixed inset-0 z-50 md:hidden', !open && 'pointer-events-none')}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="关闭菜单"
        onClick={onClose}
        className={cn(
          'absolute inset-0 h-full w-full cursor-default bg-[#070A12]/80 backdrop-blur-xl transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        className={cn(
          'absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col border-l border-white/10 bg-[#0B0F1A]/95 px-6 py-5 shadow-2xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-[0.3em] text-slate-500">MENU</span>
          <button
            type="button"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            aria-label="关闭菜单"
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-white/25 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-1" aria-label="移动端导航">
          {NAV_ITEMS.map((item, index) => (
            <Link
              key={item.id}
              to={`/#${item.id}`}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className={cn(
                'focus-ring group flex items-baseline justify-between rounded-xl px-2 py-4 transition',
                active === item.id ? 'text-white' : 'text-slate-400 hover:text-white',
              )}
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] text-slate-600">0{index + 1}</span>
                <span className="text-xl font-medium">{item.label}</span>
              </span>
              <ArrowUpRight
                size={16}
                className={cn(
                  'text-slate-600 transition group-hover:text-accent',
                  active === item.id && 'text-accent',
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] pt-5">
          <p className="text-xs text-slate-500">想聊聊？</p>
          <a
            href={`mailto:${profile.email}`}
            className="focus-ring mt-1 inline-block text-sm text-slate-200 transition hover:text-accent"
          >
            {profile.email}
          </a>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
            {profile.socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 px-3 py-1.5 transition hover:border-white/25 hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
