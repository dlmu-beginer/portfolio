import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ExternalLink, Menu } from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { Sidebar } from './Sidebar';

function getPageTitle(pathname: string): string {
  if (pathname === '/admin') return '仪表盘';
  if (pathname.startsWith('/admin/profile')) return '个人信息';
  if (pathname.startsWith('/admin/projects/new')) return '新建项目';
  if (pathname.startsWith('/admin/projects/') && pathname.endsWith('/edit')) return '编辑项目';
  if (pathname.startsWith('/admin/projects')) return '项目管理';
  if (pathname.startsWith('/admin/posts/new')) return '新建文章';
  if (pathname.startsWith('/admin/posts/') && pathname.endsWith('/edit')) return '编辑文章';
  if (pathname.startsWith('/admin/posts')) return '博客管理';
  return '后台管理';
}

export function AdminLayout(): JSX.Element {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useBodyScrollLock(open);

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

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/[0.06] lg:block">
        <Sidebar />
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="关闭菜单"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-[#070A12]/70 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-64 border-r border-white/10 shadow-2xl">
            <Sidebar onNavigate={() => setOpen(false)} onClose={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-white/[0.06] bg-[#0B0F1A]/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="打开菜单"
              aria-expanded={open}
              className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-white/25 hover:text-white lg:hidden"
            >
              <Menu size={17} />
            </button>
            <div className="min-w-0">
              <p className="font-mono text-[10px] leading-4 tracking-[0.28em] text-slate-600">
                ADMIN
              </p>
              <h1 className="truncate text-sm font-medium text-slate-100">
                {getPageTitle(pathname)}
              </h1>
            </div>
          </div>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring hidden shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-white/25 hover:text-white sm:inline-flex"
          >
            查看前台
            <ExternalLink size={12} />
          </Link>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-8 sm:py-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
