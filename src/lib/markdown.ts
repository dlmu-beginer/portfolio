export function readingMinutes(markdown: string): number {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, ' ');
  const cjk = (plain.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = (plain.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.round(cjk / 400 + words / 200));
}

export function excerptOf(markdown: string, max = 80): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/[#>*_~`|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > max ? `${plain.slice(0, max)}…` : plain;
}
