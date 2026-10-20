import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { fieldStyles } from './Input';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...rest }: SelectProps): JSX.Element {
  return (
    <select className={cn(fieldStyles, 'cursor-pointer pr-2.5', className)} {...rest}>
      {children}
    </select>
  );
}
