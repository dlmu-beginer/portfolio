export const NAV_ITEMS = [
  { id: 'about', label: '介绍' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '项目' },
  { id: 'blog', label: '博客' },
  { id: 'contact', label: '联系' },
] as const;

export const NAV_IDS = NAV_ITEMS.map((item) => item.id);
