import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { fieldStyles } from './Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function Textarea({ invalid, className, rows = 4, ...rest }: TextareaProps): JSX.Element {
  return (
    <textarea
      rows={rows}
      className={cn(
        fieldStyles,
        'resize-y leading-6',
        invalid && 'border-rose-400/60 focus:border-rose-400/60',
        className,
      )}
      {...rest}
    />
  );
}
