import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  UserRound,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { logout } from '../../lib/auth';
import { cn } from '../../lib/cn';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin', label: '仪表盘', icon: LayoutDashboard, end: true },
  { to: '/admin/profile', label: '个人信息', icon: UserRound },
  { to: '/admin/projects', label: '项目管理', icon: FolderKanban },
  { to: '/admin/posts', label: '博客管理', icon: FileText },
];

interface SidebarProps {
  onNavigate?: () => void;
  onClose?: () => void;
}

export function Sidebar({ onNavigate, onClose }: SidebarProps): JSX.Element {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex h-full flex-col bg-[#0E1420]">
      <div className="flex h-16 shrink-0 items-center justify-between px-5">
        <Link
          to="/admin"
          onClick={onNavigate}
          className="focus-ring flex items-center gap-3 rounded-full"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-[10px] border border-white/10 bg-gradient-to-br from-accent/25 to-transparent">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-accent to-accent-2 shadow-[0_0_12px_rgba(108,140,255,0.9)]" />
          </span>
          <span className="text-sm font-medium tracking-wide text-slate-200">
            后台管理
            <span className="text-accent">.</span>
          </span>
        </Link>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭菜单"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:text-white"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="后台导航">
        <p className="px-3 pb-2 font-mono text-[10px] tracking-[0.28em] text-slate-600">WORKSPACE</p>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'focus-ring relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition',
                isActive
                  ? 'bg-white/[0.06] text-white'
                  : 'text-slate-400 hover:bg-white/[0.03] hover:text-white',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-0',
                  )}
                  aria-hidden="true"
                />
                <Icon size={16} className={isActive ? 'text-accent' : 'text-slate-500'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 space-y-1 border-t border-white/[0.06] p-3">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.03] hover:text-white"
        >
          <ExternalLink size={16} className="text-slate-500" />
          查看前台
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="focus-ring flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm text-slate-400 transition hover:bg-rose-400/[0.06] hover:text-rose-300"
        >
          <LogOut size={16} className="text-slate-500" />
          退出登录
        </button>
      </div>
    </div>
  );
}
