import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
}: FormFieldProps): JSX.Element {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-xs text-slate-400">
          {label}
          {required ? <span className="text-accent"> *</span> : null}
        </label>
        {hint ? <span className="text-[11px] text-slate-600">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="mt-1.5 text-xs text-rose-400">{error}</p> : null}
    </div>
  );
}
