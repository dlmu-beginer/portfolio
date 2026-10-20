import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface BadgeProps {
  children: ReactNode;
  tone?: 'default' | 'accent' | 'success';
  className?: string;
}

const TONES = {
  default: 'border-white/10 bg-white/[0.04] text-slate-300',
  accent: 'border-accent/30 bg-accent/10 text-[#B9C7FF]',
  success: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
} as const;

export function Badge({ children, tone = 'default', className }: BadgeProps): JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs leading-none',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
