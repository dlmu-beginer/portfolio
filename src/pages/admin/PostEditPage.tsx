import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import type { Post, PostInput, PublishStatus } from '../../types/models';
import { createPost, getPostById, isSlugTaken, updatePost } from '../../lib/db';
import { isSlug, requireText } from '../../lib/validate';
import { Button, buttonStyles } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { FormField } from '../../components/admin/FormField';
import { ImageUrlField } from '../../components/admin/ImageUrlField';
import { MarkdownEditor } from '../../components/markdown/MarkdownEditor';
import { useToast } from '../../context/ToastContext';

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  tags: string;
  status: PublishStatus;
  publishedAt: string;
}

interface FormErrors {
  title?: string;
  slug?: string;
  excerpt?: string;
}

const EMPTY_FORM: PostForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverUrl: '',
  tags: '',
  status: 'draft',
  publishedAt: '',
};

function toForm(post: Post): PostForm {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverUrl: post.coverUrl ?? '',
    tags: post.tags.join(', '),
    status: post.status,
    publishedAt: post.publishedAt?.slice(0, 10) ?? '',
  };
}

function splitList(value: string): string[] {
  return value
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function PostEditPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [post] = useState<Post | undefined>(() => (id ? getPostById(id) : undefined));
  const [form, setForm] = useState<PostForm>(() => (post ? toForm(post) : EMPTY_FORM));
  const [errors, setErrors] = useState<FormErrors>({});
  const [dirty, setDirty] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const patch = <K extends keyof PostForm,>(key: K, value: PostForm[K]): void => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setDirty(true);
  };

  const handleAutoSlug = (): void => {
    const base = slugify(form.title);
    patch('slug', base || `post-${Date.now().toString(36)}`);
  };

  const handleSave = (): void => {
    const titleError = requireText(form.title, 1, 80);
    const excerptError = requireText(form.excerpt, 1, 200);
    const slugValue = form.slug.trim();

    let slugError: string | null = null;
    if (!slugValue) slugError = '请填写 slug';
    else if (!isSlug(slugValue)) slugError = '只能使用小写字母、数字与连字符';
    else if (isSlugTaken(slugValue, id)) slugError = '该 slug 已被使用';

    const nextErrors: FormErrors = {};
    if (titleError) nextErrors.title = titleError;
    if (slugError) nextErrors.slug = slugError;
    if (excerptError) nextErrors.excerpt = excerptError;
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      showToast('请检查表单填写', 'error');
      return;
    }

    const input: PostInput = {
      slug: slugValue,
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content,
      coverUrl: form.coverUrl.trim() || undefined,
      tags: splitList(form.tags),
      status: form.status,
      publishedAt: form.publishedAt
        ? new Date(`${form.publishedAt}T00:00:00`).toISOString()
        : undefined,
    };

    try {
      if (id) updatePost(id, input);
      else createPost(input);
      setDirty(false);
      showToast('保存成功');
      navigate('/admin/posts');
    } catch (error) {
      const message = error instanceof Error ? error.message : '保存失败，请重试';
      setErrors({ slug: message });
      showToast(message, 'error');
    }
  };

  if (id && !post) {
    return (
      <div className="card-surface flex flex-col items-center gap-4 px-6 py-16 text-center">
        <p className="text-sm text-slate-400">没有找到这篇文章，可能已被删除。</p>
        <Link to="/admin/posts" className={buttonStyles('secondary', 'sm')}>
          <ArrowLeft size={14} />
          返回文章列表
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/admin/posts"
            className="focus-ring mb-3 inline-flex items-center gap-1.5 rounded text-xs text-slate-500 transition hover:text-slate-200"
          >
            <ArrowLeft size={13} />
            返回文章列表
          </Link>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            {id ? '编辑文章' : '新建文章'}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            保存后前台刷新即可看到效果。
            {dirty ? <span className="ml-2 text-amber-300/80">有未保存的修改</span> : null}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/posts" className={buttonStyles('ghost', 'md')}>
            取消
          </Link>
          <Button onClick={handleSave}>
            <Save size={15} />
            保存
          </Button>
        </div>
      </div>

      <section className="card-surface space-y-5 p-5 sm:p-6">
        <h3 className="text-sm font-medium text-slate-200">基本信息</h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="标题" htmlFor="post-title" required error={errors.title}>
            <Input
              id="post-title"
              value={form.title}
              onChange={(event) => patch('title', event.target.value)}
              placeholder="文章标题"
              aria-invalid={Boolean(errors.title)}
            />
          </FormField>

          <FormField label="slug" htmlFor="post-slug" required error={errors.slug} hint="前台地址">
            <div className="flex gap-2">
              <Input
                id="post-slug"
                value={form.slug}
                onChange={(event) => patch('slug', event.target.value)}
                placeholder="canvas-starfield"
                aria-invalid={Boolean(errors.slug)}
              />
              <Button variant="secondary" size="md" onClick={handleAutoSlug} className="shrink-0">
                生成
              </Button>
            </div>
          </FormField>
        </div>

        <FormField label="摘要" htmlFor="post-excerpt" required error={errors.excerpt}>
          <Textarea
            id="post-excerpt"
            rows={3}
            value={form.excerpt}
            onChange={(event) => patch('excerpt', event.target.value)}
            placeholder="列表页展示的一句话摘要"
            aria-invalid={Boolean(errors.excerpt)}
          />
        </FormField>

        <ImageUrlField
          id="post-cover"
          label="封面图 URL"
          value={form.coverUrl}
          onChange={(value) => patch('coverUrl', value)}
        />

        <div className="grid gap-5 sm:grid-cols-3">
          <FormField label="标签" htmlFor="post-tags" hint="用逗号分隔">
            <Input
              id="post-tags"
              value={form.tags}
              onChange={(event) => patch('tags', event.target.value)}
              placeholder="Canvas, 性能"
            />
          </FormField>

          <FormField label="状态" htmlFor="post-status">
            <Select
              id="post-status"
              value={form.status}
              onChange={(event) => patch('status', event.target.value as PublishStatus)}
            >
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </Select>
          </FormField>

          <FormField
            label="发布时间"
            htmlFor="post-published"
            hint={form.status === 'published' ? '留空自动填写' : '发布时生效'}
          >
            <Input
              id="post-published"
              type="date"
              value={form.publishedAt}
              onChange={(event) => patch('publishedAt', event.target.value)}
            />
          </FormField>
        </div>
      </section>

      <section className="card-surface space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-slate-200">正文</h3>
          <span className="text-[11px] text-slate-600">支持 Markdown · Ctrl / Cmd + S 保存</span>
        </div>
        <MarkdownEditor
          value={form.content}
          onChange={(value) => patch('content', value)}
          onSave={handleSave}
          dirty={dirty}
        />
      </section>

      <div className="flex justify-end gap-2">
        <Link to="/admin/posts" className={buttonStyles('ghost', 'md')}>
          取消
        </Link>
        <Button onClick={handleSave}>
          <Save size={15} />
          保存
        </Button>
      </div>
    </div>
  );
}
