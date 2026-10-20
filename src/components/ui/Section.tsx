import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface SectionProps {
  id: string;
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Section({
  id,
  label,
  title,
  description,
  children,
  className,
}: SectionProps): JSX.Element {
  return (
    <section id={id} className={cn('scroll-mt-24 px-5 py-20 sm:px-8 md:py-28', className)}>
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="mb-3 font-mono text-[11px] tracking-[0.28em] text-accent">{label}</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
          {description ? (
            <p className="mt-4 text-[15px] leading-7 text-slate-400">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
