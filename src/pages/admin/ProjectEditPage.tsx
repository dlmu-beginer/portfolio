import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import type { Project, ProjectInput, PublishStatus } from '../../types/models';
import { createProject, getProjectById, isSlugTaken, updateProject } from '../../lib/db';
import { isSlug, requireText } from '../../lib/validate';
import { Button, buttonStyles } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { FormField } from '../../components/admin/FormField';
import { ImageUrlField } from '../../components/admin/ImageUrlField';
import { MarkdownEditor } from '../../components/markdown/MarkdownEditor';
import { useToast } from '../../context/ToastContext';

interface ProjectForm {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverUrl: string;
  tags: string;
  techStack: string;
  demoUrl: string;
  repoUrl: string;
  status: PublishStatus;
  featured: boolean;
  order: string;
  startDate: string;
  endDate: string;
}

interface FormErrors {
  title?: string;
  slug?: string;
  summary?: string;
}

const EMPTY_FORM: ProjectForm = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  coverUrl: '',
  tags: '',
  techStack: '',
  demoUrl: '',
  repoUrl: '',
  status: 'draft',
  featured: false,
  order: '0',
  startDate: '',
  endDate: '',
};

function toForm(project: Project): ProjectForm {
  return {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    content: project.content,
    coverUrl: project.coverUrl ?? '',
    tags: project.tags.join(', '),
    techStack: project.techStack.join(', '),
    demoUrl: project.demoUrl ?? '',
    repoUrl: project.repoUrl ?? '',
    status: project.status,
    featured: project.featured,
    order: String(project.order),
    startDate: project.startDate?.slice(0, 10) ?? '',
    endDate: project.endDate?.slice(0, 10) ?? '',
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

export function ProjectEditPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [project] = useState<Project | undefined>(() => (id ? getProjectById(id) : undefined));
  const [form, setForm] = useState<ProjectForm>(() => (project ? toForm(project) : EMPTY_FORM));
  const [errors, setErrors] = useState<FormErrors>({});
  const [dirty, setDirty] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const patch = <K extends keyof ProjectForm,>(key: K, value: ProjectForm[K]): void => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setDirty(true);
  };

  const handleAutoSlug = (): void => {
    const base = slugify(form.title);
    patch('slug', base || `project-${Date.now().toString(36)}`);
  };

  const handleSave = (): void => {
    const titleError = requireText(form.title, 1, 80);
    const summaryError = requireText(form.summary, 1, 200);
    const slugValue = form.slug.trim();

    let slugError: string | null = null;
    if (!slugValue) slugError = '请填写 slug';
    else if (!isSlug(slugValue)) slugError = '只能使用小写字母、数字与连字符';
    else if (isSlugTaken(slugValue, id)) slugError = '该 slug 已被使用';

    const nextErrors: FormErrors = {};
    if (titleError) nextErrors.title = titleError;
    if (slugError) nextErrors.slug = slugError;
    if (summaryError) nextErrors.summary = summaryError;
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      showToast('请检查表单填写', 'error');
      return;
    }

    const input: ProjectInput = {
      slug: slugValue,
      title: form.title.trim(),
      summary: form.summary.trim(),
      content: form.content,
      coverUrl: form.coverUrl.trim() || undefined,
      tags: splitList(form.tags),
      techStack: splitList(form.techStack),
      demoUrl: form.demoUrl.trim() || undefined,
      repoUrl: form.repoUrl.trim() || undefined,
      status: form.status,
      featured: form.featured,
      order: Math.max(0, Number.parseInt(form.order, 10) || 0),
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
    };

    try {
      if (id) updateProject(id, input);
      else createProject(input);
      setDirty(false);
      showToast('保存成功');
      navigate('/admin/projects');
    } catch (error) {
      const message = error instanceof Error ? error.message : '保存失败，请重试';
      setErrors({ slug: message });
      showToast(message, 'error');
    }
  };

  if (id && !project) {
    return (
      <div className="card-surface flex flex-col items-center gap-4 px-6 py-16 text-center">
        <p className="text-sm text-slate-400">没有找到这个项目，可能已被删除。</p>
        <Link to="/admin/projects" className={buttonStyles('secondary', 'sm')}>
          <ArrowLeft size={14} />
          返回项目列表
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/admin/projects"
            className="focus-ring mb-3 inline-flex items-center gap-1.5 rounded text-xs text-slate-500 transition hover:text-slate-200"
          >
            <ArrowLeft size={13} />
            返回项目列表
          </Link>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            {id ? '编辑项目' : '新建项目'}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            保存后前台刷新即可看到效果。
            {dirty ? <span className="ml-2 text-amber-300/80">有未保存的修改</span> : null}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/projects" className={buttonStyles('ghost', 'md')}>
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
          <FormField label="标题" htmlFor="project-title" required error={errors.title}>
            <Input
              id="project-title"
              value={form.title}
              onChange={(event) => patch('title', event.target.value)}
              placeholder="项目名称"
              aria-invalid={Boolean(errors.title)}
            />
          </FormField>

          <FormField label="slug" htmlFor="project-slug" required error={errors.slug} hint="前台地址">
            <div className="flex gap-2">
              <Input
                id="project-slug"
                value={form.slug}
                onChange={(event) => patch('slug', event.target.value)}
                placeholder="aurora-dashboard"
                aria-invalid={Boolean(errors.slug)}
              />
              <Button variant="secondary" size="md" onClick={handleAutoSlug} className="shrink-0">
                生成
              </Button>
            </div>
          </FormField>
        </div>

        <FormField label="摘要" htmlFor="project-summary" required error={errors.summary}>
          <Textarea
            id="project-summary"
            rows={3}
            value={form.summary}
            onChange={(event) => patch('summary', event.target.value)}
            placeholder="一两句话说明项目解决的问题"
            aria-invalid={Boolean(errors.summary)}
          />
        </FormField>

        <ImageUrlField
          id="project-cover"
          label="封面图 URL"
          value={form.coverUrl}
          onChange={(value) => patch('coverUrl', value)}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="标签" htmlFor="project-tags" hint="用逗号分隔">
            <Input
              id="project-tags"
              value={form.tags}
              onChange={(event) => patch('tags', event.target.value)}
              placeholder="数据可视化, 中后台"
            />
          </FormField>
          <FormField label="技术栈" htmlFor="project-stack" hint="用逗号分隔">
            <Input
              id="project-stack"
              value={form.techStack}
              onChange={(event) => patch('techStack', event.target.value)}
              placeholder="React, TypeScript, D3"
            />
          </FormField>
        </div>
      </section>

      <section className="card-surface space-y-5 p-5 sm:p-6">
        <h3 className="text-sm font-medium text-slate-200">发布设置</h3>

        <div className="grid gap-5 sm:grid-cols-3">
          <FormField label="状态" htmlFor="project-status">
            <Select
              id="project-status"
              value={form.status}
              onChange={(event) => patch('status', event.target.value as PublishStatus)}
            >
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </Select>
          </FormField>

          <FormField label="排序" htmlFor="project-order" hint="数字越小越靠前">
            <Input
              id="project-order"
              type="number"
              min={0}
              value={form.order}
              onChange={(event) => patch('order', event.target.value)}
            />
          </FormField>

          <div className="flex items-end pb-2.5">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => patch('featured', event.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-white/20 bg-white/[0.04] accent-[#6C8CFF]"
              />
              设为精选
            </label>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="开始时间" htmlFor="project-start">
            <Input
              id="project-start"
              type="date"
              value={form.startDate}
              onChange={(event) => patch('startDate', event.target.value)}
            />
          </FormField>
          <FormField label="结束时间" htmlFor="project-end">
            <Input
              id="project-end"
              type="date"
              value={form.endDate}
              onChange={(event) => patch('endDate', event.target.value)}
            />
          </FormField>
          <FormField label="Demo 链接" htmlFor="project-demo">
            <Input
              id="project-demo"
              value={form.demoUrl}
              onChange={(event) => patch('demoUrl', event.target.value)}
              placeholder="https://…"
            />
          </FormField>
          <FormField label="仓库链接" htmlFor="project-repo">
            <Input
              id="project-repo"
              value={form.repoUrl}
              onChange={(event) => patch('repoUrl', event.target.value)}
              placeholder="https://github.com/…"
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
        <Link to="/admin/projects" className={buttonStyles('ghost', 'md')}>
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
