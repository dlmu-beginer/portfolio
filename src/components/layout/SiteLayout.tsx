import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { applySiteMeta } from '../../lib/meta';
import { StarField } from './StarField';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';

export function SiteLayout(): JSX.Element {
  useEffect(() => {
    applySiteMeta();
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="aurora-bg pointer-events-none fixed inset-0" aria-hidden="true" />
      <StarField />

      <div className="relative z-10 flex min-h-screen flex-col">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
