import { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';

interface SmartImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  fallbackClassName?: string;
  /** 图片加载结果回调，后台预览用它提示「链接不可用」 */
  onStatusChange?: (status: 'loaded' | 'failed') => void;
}

export function SmartImage({
  src,
  alt,
  className,
  fallbackText,
  fallbackClassName,
  onStatusChange,
}: SmartImageProps): JSX.Element {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'relative flex items-center justify-center overflow-hidden bg-surface-2',
          className,
        )}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(108,140,255,0.38),transparent_62%),radial-gradient(circle_at_76%_82%,rgba(56,189,248,0.24),transparent_58%)]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <span
          className={cn(
            'relative font-semibold tracking-tight text-white/70',
            fallbackClassName ?? 'text-3xl',
          )}
        >
          {fallbackText ?? alt.slice(0, 1)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      // 很多图床/相册会校验 Referer，带上 no-referrer 才不会被拦成 403
      referrerPolicy="no-referrer"
      onLoad={() => onStatusChange?.('loaded')}
      onError={() => {
        setFailed(true);
        onStatusChange?.('failed');
      }}
      className={className}
    />
  );
}
