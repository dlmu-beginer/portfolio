import { Link } from 'react-router-dom';
import { buttonStyles } from '../components/ui/Button';

export function NotFoundPage(): JSX.Element {
  return (
    <section className="flex min-h-[75vh] flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-[11px] tracking-[0.3em] text-accent">// 404 NOT FOUND</p>
      <h1 className="text-gradient mt-4 text-7xl font-semibold tracking-tight sm:text-8xl">404</h1>
      <p className="mt-5 text-sm text-slate-400">这个页面好像漂到别的星系去了。</p>
      <Link to="/" className={buttonStyles('primary', 'md', 'mt-8')}>
        回到首页
      </Link>
    </section>
  );
}
