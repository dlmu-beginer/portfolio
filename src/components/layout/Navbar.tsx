import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu } from 'lucide-react';
import { getProfile } from '../../lib/db';
import { cn } from '../../lib/cn';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { buttonStyles } from '../ui/Button';
import { MobileMenu } from './MobileMenu';
import { NAV_IDS, NAV_ITEMS } from './navItems';

export function Navbar(): JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [profile] = useState(() => getProfile());
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const active = useScrollSpy(NAV_IDS, isHome);

  useBodyScrollLock(open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleLogoClick = () => {
    if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-300',
          scrolled ? 'glass-nav' : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="focus-ring flex items-center gap-3 rounded-full"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-accent/25 to-transparent">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-accent to-accent-2 shadow-[0_0_12px_rgba(108,140,255,0.9)]" />
            </span>
            <span className="text-sm font-medium tracking-wide text-slate-200">
              {profile.name || 'Portfolio'}
              <span className="text-accent">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
            {NAV_ITEMS.map((item) => {
              const isActive = isHome && active === item.id;
              return (
                <Link
                  key={item.id}
                  to={`/#${item.id}`}
                  className={cn(
                    'focus-ring relative rounded-full px-4 py-2 text-sm transition',
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white',
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute inset-x-4 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-accent to-transparent transition-opacity',
                      isActive ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              to="/#contact"
              className={cn(buttonStyles('primary', 'sm'), 'hidden sm:inline-flex')}
            >
              联系我
              <ArrowUpRight size={14} />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="打开菜单"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-white/25 hover:text-white md:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} active={active} profile={profile} onClose={() => setOpen(false)} />
    </>
  );
}
