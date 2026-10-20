import { useEffect, useState } from 'react';

export function useScrollSpy(ids: readonly string[], enabled = true): string {
  const [active, setActive] = useState('');

  useEffect(() => {
    if (!enabled) return;
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids, enabled]);

  return active;
}
