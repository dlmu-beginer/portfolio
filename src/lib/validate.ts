export const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

export function requireText(value: string, min: number, max: number): string | null {
  const length = value.trim().length;
  if (length === 0) return '此项为必填';
  if (length < min) return `至少 ${min} 个字符`;
  if (length > max) return `不能超过 ${max} 个字符`;
  return null;
}

export const isSlug = (value: string): boolean => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

export function optionalText(value: string, max: number): string | null {
  if (value.trim().length > max) return `不能超过 ${max} 个字符`;
  return null;
}
