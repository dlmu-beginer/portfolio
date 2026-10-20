import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function ScrollToTop(): null {
  const { pathname, hash } = useLocation();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        const frame = requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        });
        return () => cancelAnimationFrame(frame);
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
    return undefined;
  }, [pathname, hash, reduced]);

  return null;
}
