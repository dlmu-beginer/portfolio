import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

const BASE =
  'focus-ring inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTS = {
  primary:
    'bg-accent text-[#07101F] shadow-[0_10px_36px_-14px_rgba(108,140,255,0.9)] hover:bg-[#849EFF]',
  secondary:
    'border border-white/10 bg-white/[0.03] text-slate-100 hover:border-white/25 hover:bg-white/[0.06]',
  ghost: 'text-slate-400 hover:bg-white/[0.04] hover:text-white',
} as const;

const SIZES = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button type={type} className={buttonStyles(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
