import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SmartImage } from '../ui/SmartImage';

interface MarkdownViewProps {
  content: string;
}

export function MarkdownView({ content }: MarkdownViewProps): JSX.Element {
  return (
    <div className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white prose-p:text-slate-300 prose-p:leading-8 prose-li:text-slate-300 prose-li:leading-7 prose-strong:text-white prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-accent/50 prose-blockquote:text-slate-400 prose-blockquote:not-italic prose-code:rounded prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:font-normal prose-code:text-[#A9C4FF] prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-white/10 prose-pre:bg-[#0D1117] prose-pre:text-slate-200 prose-hr:border-white/10 prose-table:text-sm prose-th:border-white/10 prose-th:text-slate-200 prose-td:border-white/10 prose-td:text-slate-300 prose-img:rounded-xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <SmartImage
              src={typeof src === 'string' ? src : undefined}
              alt={alt ?? ''}
              className="w-full rounded-xl"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
