import { useRef, useState, type KeyboardEvent } from 'react';
import {
  Bold,
  Code2,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { readingMinutes } from '../../lib/markdown';
import { MarkdownView } from './MarkdownView';

interface ToolbarAction {
  label: string;
  icon: LucideIcon;
  prefix: string;
  suffix: string;
  placeholder: string;
}

const ACTIONS: ToolbarAction[] = [
  { label: '加粗', icon: Bold, prefix: '**', suffix: '**', placeholder: '加粗文本' },
  { label: '斜体', icon: Italic, prefix: '*', suffix: '*', placeholder: '斜体文本' },
  { label: '标题', icon: Heading2, prefix: '## ', suffix: '', placeholder: '小标题' },
  { label: '链接', icon: Link2, prefix: '[', suffix: '](https://)', placeholder: '链接文字' },
  { label: '行内代码', icon: Code2, prefix: '`', suffix: '`', placeholder: 'code' },
  { label: '无序列表', icon: List, prefix: '- ', suffix: '', placeholder: '列表项' },
  { label: '有序列表', icon: ListOrdered, prefix: '1. ', suffix: '', placeholder: '列表项' },
  { label: '引用', icon: Quote, prefix: '> ', suffix: '', placeholder: '引用内容' },
];

interface MarkdownEditorProps {
  value: string;
  onChange: (next: string) => void;
  onSave?: () => void;
  dirty?: boolean;
}

export function MarkdownEditor({ value, onChange, onSave, dirty }: MarkdownEditorProps): JSX.Element {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');

  const insert = (prefix: string, suffix: string, placeholder: string): void => {
    const element = textareaRef.current;
    if (!element) return;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const next = `${value.slice(0, start)}${prefix}${selected}${suffix}${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      element.focus();
      const cursor = start + prefix.length + selected.length + suffix.length;
      element.setSelectionRange(cursor, cursor);
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Tab') {
      event.preventDefault();
      insert('  ', '', '');
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      onSave?.();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1 rounded-[10px] border border-white/10 bg-white/[0.03] p-1 md:hidden">
          {(['edit', 'preview'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTab(mode)}
              className={cn(
                'focus-ring rounded-lg px-3 py-1.5 text-xs transition',
                tab === mode ? 'bg-accent/15 text-white' : 'text-slate-400 hover:text-white',
              )}
            >
              {mode === 'edit' ? '编辑' : '预览'}
            </button>
          ))}
        </div>
        <p className="ml-auto text-[11px] text-slate-600">
          {dirty ? <span className="mr-2 text-amber-300/80">未保存</span> : null}
          {value.length} 字符 · 约 {readingMinutes(value)} 分钟
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className={cn('flex-col', tab === 'edit' ? 'flex' : 'hidden md:flex')}>
          <div className="flex flex-wrap gap-1 rounded-t-[10px] border border-b-0 border-white/10 bg-white/[0.02] p-1.5">
            {ACTIONS.map(({ label, icon: Icon, prefix, suffix, placeholder }) => (
              <button
                key={label}
                type="button"
                title={label}
                aria-label={label}
                onClick={() => insert(prefix, suffix, placeholder)}
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            placeholder="用 Markdown 写正文，支持标题、列表、代码块与表格。"
            className="focus-ring min-h-[420px] flex-1 resize-y rounded-b-[10px] border border-white/10 bg-[#0D1117]/70 px-4 py-3 font-mono text-[13px] leading-6 text-slate-200 placeholder:text-slate-600 transition focus:border-accent/50"
          />
        </div>

        <div
          className={cn(
            'min-h-[420px] overflow-auto rounded-[10px] border border-white/10 bg-[#0D1117]/40 p-5',
            tab === 'preview' ? 'block' : 'hidden md:block',
          )}
        >
          {value.trim() ? (
            <MarkdownView content={value} />
          ) : (
            <p className="text-sm text-slate-600">左侧输入内容后，这里会实时预览。</p>
          )}
        </div>
      </div>
    </div>
  );
}
