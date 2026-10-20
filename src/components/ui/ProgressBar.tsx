import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className }: ProgressBarProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();
  const safe = Math.min(100, Math.max(0, value));

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safe}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]', className)}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-[width] duration-700 ease-out"
        style={{ width: visible || reduced ? `${safe}%` : '0%' }}
      />
    </div>
  );
}
