import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, Clock, MapPin, Send } from 'lucide-react';
import type { Profile } from '../../types/models';
import { createMessage } from '../../lib/db';
import { isEmail, optionalText, requireText } from '../../lib/validate';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';

const INPUT_CLASS =
  'focus-ring w-full rounded-[10px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 transition focus:border-accent/50';

interface FormState {
  name: string;
  email: string;
  subject: string;
  content: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = { name: '', email: '', subject: '', content: '' };

interface ContactSectionProps {
  profile: Profile;
}

export function ContactSection({ profile }: ContactSectionProps): JSX.Element {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);

  const handleChange =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const { value } = event.target;
      setForm((previous) => ({ ...previous, [field]: value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    const nameError = requireText(form.name, 2, 50);
    if (nameError) nextErrors.name = nameError;
    if (!isEmail(form.email.trim())) nextErrors.email = '请输入合法的邮箱地址';
    const contentError = requireText(form.content, 10, 1000);
    if (contentError) nextErrors.content = contentError;
    const subjectError = optionalText(form.subject, 100);
    if (subjectError) nextErrors.subject = subjectError;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    createMessage({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim() || undefined,
      content: form.content.trim(),
    });
    setForm(EMPTY_FORM);
    setSent(true);
  };

  return (
    <Section
      id="contact"
      label="// 05 CONTACT"
      title="联系我"
      description="有项目想聊，或者只是想打个招呼，都欢迎。"
    >
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div className="space-y-8">
          <div>
            <a
              href={`mailto:${profile.email}`}
              className="focus-ring group inline-flex items-center gap-2 rounded text-lg text-slate-200 transition hover:text-accent sm:text-xl"
            >
              {profile.email || 'hello@example.com'}
              <ArrowUpRight
                size={18}
                className="text-slate-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </a>
            <p className="mt-2 text-xs text-slate-500">通常 24 小时内回复</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-slate-400">
              <MapPin size={15} className="text-accent" />
              {profile.location || '地球某处'}
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <Clock size={15} className="text-accent" />
              北京时间 UTC+8
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {profile.socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring card-surface flex items-center justify-between px-4 py-3 text-sm text-slate-300 transition hover:border-accent/30 hover:text-white"
              >
                <span>{social.label}</span>
                <ArrowUpRight size={14} className="text-slate-600" />
              </a>
            ))}
          </div>
        </div>

        <div className="card-surface p-6 sm:p-8">
          {sent ? (
            <div className="mb-6 flex items-start gap-3 rounded-[10px] border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3 text-sm text-emerald-300">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              留言已保存，谢谢你！我会尽快回复。
            </div>
          ) : null}

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-xs text-slate-400">
                  姓名 <span className="text-accent">*</span>
                </label>
                <input
                  id="contact-name"
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder="怎么称呼你"
                  aria-invalid={Boolean(errors.name)}
                  className={INPUT_CLASS}
                />
                {errors.name ? <p className="mt-1.5 text-xs text-rose-400">{errors.name}</p> : null}
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-2 block text-xs text-slate-400">
                  邮箱 <span className="text-accent">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  className={INPUT_CLASS}
                />
                {errors.email ? (
                  <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p>
                ) : null}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="contact-subject" className="mb-2 block text-xs text-slate-400">
                主题
              </label>
              <input
                id="contact-subject"
                value={form.subject}
                onChange={handleChange('subject')}
                placeholder="想聊点什么（可选）"
                className={INPUT_CLASS}
              />
              {errors.subject ? (
                <p className="mt-1.5 text-xs text-rose-400">{errors.subject}</p>
              ) : null}
            </div>

            <div className="mt-5">
              <label htmlFor="contact-content" className="mb-2 block text-xs text-slate-400">
                内容 <span className="text-accent">*</span>
              </label>
              <textarea
                id="contact-content"
                rows={5}
                value={form.content}
                onChange={handleChange('content')}
                placeholder="简单说下你的想法，至少 10 个字。"
                aria-invalid={Boolean(errors.content)}
                className={`${INPUT_CLASS} resize-y`}
              />
              {errors.content ? (
                <p className="mt-1.5 text-xs text-rose-400">{errors.content}</p>
              ) : null}
            </div>

            <Button type="submit" className="mt-6 w-full">
              发送留言
              <Send size={15} />
            </Button>

            <p className="mt-4 text-center text-[11px] text-slate-600">
              演示环境：留言仅保存在本地浏览器，不会真的发送邮件。
            </p>
          </form>
        </div>
      </div>
    </Section>
  );
}
