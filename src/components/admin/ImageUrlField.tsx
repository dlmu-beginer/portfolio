import { SmartImage } from '../ui/SmartImage';
import { Input } from '../ui/Input';
import { FormField } from './FormField';

interface ImageUrlFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ImageUrlField({
  id,
  label,
  value,
  onChange,
  placeholder = '/covers/aurora.svg 或 https://…',
}: ImageUrlFieldProps): JSX.Element {
  return (
    <FormField label={label} htmlFor={id} hint="留空时显示渐变占位">
      <div className="flex items-start gap-3">
        <div className="h-16 w-28 shrink-0 overflow-hidden rounded-[10px] border border-white/10 bg-surface-2">
          <SmartImage
            src={value.trim() || undefined}
            alt="封面预览"
            fallbackText="封面"
            fallbackClassName="text-xs"
            className="h-full w-full object-cover"
          />
        </div>
        <Input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      </div>
    </FormField>
  );
}
