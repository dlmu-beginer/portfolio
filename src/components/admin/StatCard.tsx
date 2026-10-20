import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  hint?: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, hint, icon: Icon }: StatCardProps): JSX.Element {
  return (
    <div className="card-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-slate-400">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.04] text-accent">
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-slate-500">{hint}</p> : null}
    </div>
  );
}
