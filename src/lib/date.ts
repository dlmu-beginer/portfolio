export function formatDate(iso?: string): string {
  if (!iso) return '未发布';
  return iso.slice(0, 10);
}

/**
 * 从时间线的「2021.09 — 至今」这类字符串里取最早年份，估算工作年限。
 * 没有年份时返回 undefined，调用方负责隐藏对应展示。
 */
export function estimateYearsOfExperience(periods: string[]): number | undefined {
  const years = periods
    .map((period) => period.match(/(?:19|20)\d{2}/)?.[0])
    .filter((year): year is string => Boolean(year))
    .map(Number);

  if (years.length === 0) return undefined;
  const diff = new Date().getFullYear() - Math.min(...years);
  return diff > 0 ? diff : undefined;
}
