import { getProfile } from './db';

const FALLBACK_TITLE = '个人作品集';

export function applySiteMeta(): void {
  const profile = getProfile();
  const name = profile.name.trim();
  const headline = profile.headline.trim();

  document.title = name ? `${name}${headline ? ` · ${headline}` : ''}` : FALLBACK_TITLE;

  const description = profile.tagline.trim() || profile.bio.trim();
  if (!description) return;

  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', description);
}
