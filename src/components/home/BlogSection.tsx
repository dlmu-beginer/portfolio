import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Post } from '../../types/models';
import { formatDate } from '../../lib/date';
import { readingMinutes } from '../../lib/markdown';
import { Section } from '../ui/Section';

interface BlogSectionProps {
  posts: Post[];
}

export function BlogSection({ posts }: BlogSectionProps): JSX.Element {
  return (
    <Section
      id="blog"
      label="// 04 WRITING"
      title="博客"
      description="记录一些踩过的坑、想清楚的事，以及还没有想清楚的事。"
    >
      {posts.length > 0 ? (
        <div className="border-y border-white/[0.06]">
          {posts.slice(0, 4).map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="focus-ring group flex flex-col gap-2 border-b border-white/[0.06] py-6 transition last:border-b-0 hover:bg-white/[0.02] sm:flex-row sm:items-center sm:gap-8 sm:px-3"
            >
              <time className="shrink-0 font-mono text-[11px] tracking-wider text-slate-500 sm:w-24">
                {formatDate(post.publishedAt)}
              </time>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-medium text-slate-200 transition group-hover:text-white">
                  {post.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-sm text-slate-500">{post.excerpt}</p>
              </div>

              <div className="flex shrink-0 items-center gap-4 text-[11px] text-slate-500">
                {post.tags[0] ? (
                  <span className="hidden rounded-full border border-white/10 px-2.5 py-0.5 sm:inline">
                    {post.tags[0]}
                  </span>
                ) : null}
                <span className="font-mono">{readingMinutes(post.content)} 分钟</span>
                <ArrowUpRight
                  size={16}
                  className="text-slate-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card-surface flex h-40 items-center justify-center text-sm text-slate-500">
          还没有发布文章
        </div>
      )}
    </Section>
  );
}
