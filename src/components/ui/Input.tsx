import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export const fieldStyles =
  'focus-ring w-full rounded-[10px] border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 transition focus:border-accent/50 disabled:cursor-not-allowed disabled:opacity-60';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ invalid, className, ...rest }: InputProps): JSX.Element {
  return (
    <input
      className={cn(fieldStyles, invalid && 'border-rose-400/60 focus:border-rose-400/60', className)}
      {...rest}
    />
  );
}
