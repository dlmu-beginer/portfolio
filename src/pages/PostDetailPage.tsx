import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPostBySlug } from '../lib/db';
import { formatDate } from '../lib/date';
import { readingMinutes } from '../lib/markdown';
import { Badge } from '../components/ui/Badge';
import { SmartImage } from '../components/ui/SmartImage';
import { MarkdownView } from '../components/markdown/MarkdownView';
import { NotFoundPage } from './NotFoundPage';

export function PostDetailPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <NotFoundPage />;

  return (
    <article className="px-5 pb-24 pt-28 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/#blog"
          className="focus-ring inline-flex items-center gap-1.5 rounded text-xs text-slate-500 transition hover:text-white"
        >
          <ArrowLeft size={14} />
          返回文章列表
        </Link>

        <div className="mt-9 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
          <time className="font-mono tracking-wider">{formatDate(post.publishedAt)}</time>
          <span className="h-3 w-px bg-white/10" aria-hidden="true" />
          <span className="font-mono">{readingMinutes(post.content)} 分钟阅读</span>
        </div>

        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-slate-400">{post.excerpt}</p>

        {post.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        ) : null}

        {post.coverUrl ? (
          <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-surface-2">
            <SmartImage
              src={post.coverUrl}
              alt={post.title}
              fallbackText={post.title.slice(0, 1)}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="mt-10">
          <MarkdownView content={post.content} />
        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-8">
          <Link
            to="/#blog"
            className="focus-ring inline-flex items-center gap-1.5 rounded text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            继续阅读其它文章
          </Link>
        </div>
      </div>
    </article>
  );
}
