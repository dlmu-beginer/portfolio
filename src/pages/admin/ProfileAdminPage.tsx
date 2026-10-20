import { useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from 'lucide-react';
import type {
  Profile,
  Skill,
  SkillCategory,
  SocialLink,
  TimelineItem,
  TimelineType,
} from '../../types/models';
import { getProfile, saveProfile } from '../../lib/db';
import { isEmail } from '../../lib/validate';
import { applySiteMeta } from '../../lib/meta';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { SmartImage } from '../../components/ui/SmartImage';
import { FormField } from '../../components/admin/FormField';
import { useToast } from '../../context/ToastContext';

const SKILL_CATEGORIES: Array<{ value: SkillCategory; label: string }> = [
  { value: 'frontend', label: '前端' },
  { value: 'backend', label: '后端' },
  { value: 'design', label: '设计' },
  { value: 'tool', label: '工具' },
  { value: 'other', label: '其他' },
];

const TIMELINE_TYPES: Array<{ value: TimelineType; label: string }> = [
  { value: 'work', label: '工作' },
  { value: 'education', label: '教育' },
  { value: 'award', label: '荣誉' },
  { value: 'other', label: '其他' },
];

function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function moveItem<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

interface RowActionsProps {
  index: number;
  length: number;
  label: string;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
}

function RowActions({ index, length, label, onMove, onRemove }: RowActionsProps): JSX.Element {
  const buttonClass =
    'focus-ring flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-30';

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        aria-label={`上移${label}`}
        disabled={index === 0}
        onClick={() => onMove(index, -1)}
        className={buttonClass}
      >
        <ArrowUp size={14} />
      </button>
      <button
        type="button"
        aria-label={`下移${label}`}
        disabled={index === length - 1}
        onClick={() => onMove(index, 1)}
        className={buttonClass}
      >
        <ArrowDown size={14} />
      </button>
      <button
        type="button"
        aria-label={`删除${label}`}
        onClick={() => onRemove(index)}
        className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-500 transition hover:border-rose-400/30 hover:text-rose-300"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

interface FormErrors {
  name?: string;
  email?: string;
}

export function ProfileAdminPage(): JSX.Element {
  const [profile, setProfile] = useState<Profile>(() => structuredClone(getProfile()));
  const [errors, setErrors] = useState<FormErrors>({});
  const [dirty, setDirty] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const { showToast } = useToast();

  const commit = (updater: (previous: Profile) => Profile): void => {
    setProfile(updater);
    setDirty(true);
  };

  const patch = <K extends keyof Profile,>(key: K, value: Profile[K]): void => {
    commit((previous) => ({ ...previous, [key]: value }));
  };

  const updateSocial = (id: string, changes: Partial<SocialLink>): void => {
    commit((previous) => ({
      ...previous,
      socials: previous.socials.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    }));
  };

  const updateSkill = (id: string, changes: Partial<Skill>): void => {
    commit((previous) => ({
      ...previous,
      skills: previous.skills.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    }));
  };

  const updateTimeline = (id: string, changes: Partial<TimelineItem>): void => {
    commit((previous) => ({
      ...previous,
      timeline: previous.timeline.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    }));
  };

  const handleSave = (): void => {
    const nextErrors: FormErrors = {};
    if (!profile.name.trim()) nextErrors.name = '请填写姓名';
    if (profile.email.trim() && !isEmail(profile.email.trim())) {
      nextErrors.email = '请输入合法的邮箱地址';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      showToast('请检查表单填写', 'error');
      return;
    }

    saveProfile({
      ...profile,
      name: profile.name.trim(),
      email: profile.email.trim(),
      socials: profile.socials.filter((item) => item.label.trim() || item.url.trim()),
    });
    applySiteMeta();
    setDirty(false);
    showToast('保存成功');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.28em] text-accent">// PROFILE</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">个人信息</h2>
          <p className="mt-2 text-sm text-slate-400">
            修改后点击保存，前台刷新即可生效。
            {dirty ? <span className="ml-2 text-amber-300/80">有未保存的修改</span> : null}
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save size={15} />
          保存修改
        </Button>
      </div>

      <section className="card-surface space-y-5 p-5 sm:p-6">
        <h3 className="text-sm font-medium text-slate-200">基本信息</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="姓名" htmlFor="profile-name" required error={errors.name}>
            <Input
              id="profile-name"
              value={profile.name}
              onChange={(event) => patch('name', event.target.value)}
              placeholder="你的名字"
              aria-invalid={Boolean(errors.name)}
            />
          </FormField>
          <FormField label="一句话定位" htmlFor="profile-headline">
            <Input
              id="profile-headline"
              value={profile.headline}
              onChange={(event) => patch('headline', event.target.value)}
              placeholder="全栈工程师 · 交互与性能"
            />
          </FormField>
          <FormField label="位置" htmlFor="profile-location">
            <Input
              id="profile-location"
              value={profile.location}
              onChange={(event) => patch('location', event.target.value)}
              placeholder="城市 · 区域"
            />
          </FormField>
          <FormField label="邮箱" htmlFor="profile-email" error={errors.email}>
            <Input
              id="profile-email"
              type="email"
              value={profile.email}
              onChange={(event) => patch('email', event.target.value)}
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
            />
          </FormField>
          <FormField
            label="头像 URL"
            htmlFor="profile-avatar"
            hint="留空显示姓名首字；请填可直接访问的图片直链"
          >
            <div className="flex items-start gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-surface-2">
                <SmartImage
                  src={profile.avatarUrl.trim() || undefined}
                  alt="头像预览"
                  fallbackText={(profile.name || '头').slice(0, 1)}
                  fallbackClassName="text-lg"
                  className="h-full w-full object-cover"
                  onStatusChange={(status) => setAvatarFailed(status === 'failed')}
                />
              </div>
              <div className="min-w-0 flex-1">
                <Input
                  id="profile-avatar"
                  value={profile.avatarUrl}
                  onChange={(event) => {
                    setAvatarFailed(false);
                    patch('avatarUrl', event.target.value);
                  }}
                  placeholder="https://…/avatar.jpg"
                />
                {avatarFailed ? (
                  <p className="mt-2 text-xs leading-5 text-rose-300">
                    图片加载失败：这里需要图片直链（如 https://…/me.jpg），网页链接或需要登录的地址无法显示。
                  </p>
                ) : null}
              </div>
            </div>
          </FormField>
          <FormField label="Hero 副标题" htmlFor="profile-tagline">
            <Input
              id="profile-tagline"
              value={profile.tagline}
              onChange={(event) => patch('tagline', event.target.value)}
              placeholder="Hero 区的一句话介绍"
            />
          </FormField>
        </div>
        <FormField label="自我介绍" htmlFor="profile-bio" hint="支持换行">
          <Textarea
            id="profile-bio"
            rows={5}
            value={profile.bio}
            onChange={(event) => patch('bio', event.target.value)}
            placeholder="介绍一下你自己"
          />
        </FormField>
      </section>

      <section className="card-surface space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-slate-200">社交链接</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              commit((previous) => ({
                ...previous,
                socials: [
                  ...previous.socials,
                  { id: newId('s'), platform: 'website', label: '网站', url: 'https://' },
                ],
              }))
            }
          >
            <Plus size={14} />
            添加链接
          </Button>
        </div>

        {profile.socials.length > 0 ? (
          <div className="space-y-3">
            {profile.socials.map((social, index) => (
              <div key={social.id} className="grid gap-3 sm:grid-cols-12">
                <div className="sm:col-span-2">
                  <Input
                    value={social.platform}
                    onChange={(event) => updateSocial(social.id, { platform: event.target.value })}
                    placeholder="github"
                    aria-label="平台"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    value={social.label}
                    onChange={(event) => updateSocial(social.id, { label: event.target.value })}
                    placeholder="显示名称"
                    aria-label="显示名称"
                  />
                </div>
                <div className="sm:col-span-5">
                  <Input
                    value={social.url}
                    onChange={(event) => updateSocial(social.id, { url: event.target.value })}
                    placeholder="https://…"
                    aria-label="链接地址"
                  />
                </div>
                <div className="flex items-center justify-end sm:col-span-2">
                  <RowActions
                    index={index}
                    length={profile.socials.length}
                    label="链接"
                    onMove={(from, direction) =>
                      commit((previous) => ({
                        ...previous,
                        socials: moveItem(previous.socials, from, direction),
                      }))
                    }
                    onRemove={(removeIndex) =>
                      commit((previous) => ({
                        ...previous,
                        socials: previous.socials.filter((_, itemIndex) => itemIndex !== removeIndex),
                      }))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-[10px] border border-dashed border-white/10 px-4 py-6 text-center text-sm text-slate-500">
            还没有社交链接，点右上角添加。
          </p>
        )}
      </section>

      <section className="card-surface space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-slate-200">技能</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              commit((previous) => ({
                ...previous,
                skills: [
                  ...previous.skills,
                  { id: newId('k'), name: '新技能', icon: 'code', category: 'frontend', level: 80 },
                ],
              }))
            }
          >
            <Plus size={14} />
            添加技能
          </Button>
        </div>

        {profile.skills.length > 0 ? (
          <div className="space-y-3">
            {profile.skills.map((skill, index) => (
              <div key={skill.id} className="grid items-center gap-3 sm:grid-cols-12">
                <div className="sm:col-span-3">
                  <Input
                    value={skill.name}
                    onChange={(event) => updateSkill(skill.id, { name: event.target.value })}
                    placeholder="技能名称"
                    aria-label="技能名称"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Select
                    value={skill.category}
                    onChange={(event) =>
                      updateSkill(skill.id, { category: event.target.value as SkillCategory })
                    }
                    aria-label="技能分类"
                  >
                    {SKILL_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Input
                    value={skill.icon}
                    onChange={(event) => updateSkill(skill.id, { icon: event.target.value })}
                    placeholder="icon key"
                    aria-label="图标 key"
                  />
                </div>
                <div className="flex items-center gap-3 sm:col-span-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={skill.level}
                    onChange={(event) => updateSkill(skill.id, { level: Number(event.target.value) })}
                    aria-label={`${skill.name} 熟练度`}
                    className="h-1.5 w-full cursor-pointer accent-[#6C8CFF]"
                  />
                  <span className="w-9 shrink-0 text-right font-mono text-[11px] text-slate-400">
                    {skill.level}
                  </span>
                </div>
                <div className="flex items-center justify-end sm:col-span-2">
                  <RowActions
                    index={index}
                    length={profile.skills.length}
                    label="技能"
                    onMove={(from, direction) =>
                      commit((previous) => ({
                        ...previous,
                        skills: moveItem(previous.skills, from, direction),
                      }))
                    }
                    onRemove={(removeIndex) =>
                      commit((previous) => ({
                        ...previous,
                        skills: previous.skills.filter((_, itemIndex) => itemIndex !== removeIndex),
                      }))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-[10px] border border-dashed border-white/10 px-4 py-6 text-center text-sm text-slate-500">
            还没有技能，点右上角添加。
          </p>
        )}
      </section>

      <section className="card-surface space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-slate-200">时间线</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              commit((previous) => ({
                ...previous,
                timeline: [
                  ...previous.timeline,
                  {
                    id: newId('t'),
                    period: '2024 — 至今',
                    title: '新经历',
                    organization: '',
                    description: '',
                    type: 'work',
                  },
                ],
              }))
            }
          >
            <Plus size={14} />
            添加经历
          </Button>
        </div>

        {profile.timeline.length > 0 ? (
          <div className="space-y-4">
            {profile.timeline.map((item, index) => (
              <div key={item.id} className="space-y-3 rounded-[10px] border border-white/[0.06] p-3">
                <div className="grid gap-3 sm:grid-cols-12">
                  <div className="sm:col-span-3">
                    <Input
                      value={item.period}
                      onChange={(event) => updateTimeline(item.id, { period: event.target.value })}
                      placeholder="2023.07 — 至今"
                      aria-label="时间段"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Input
                      value={item.title}
                      onChange={(event) => updateTimeline(item.id, { title: event.target.value })}
                      placeholder="标题"
                      aria-label="经历标题"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Input
                      value={item.organization}
                      onChange={(event) =>
                        updateTimeline(item.id, { organization: event.target.value })
                      }
                      placeholder="组织"
                      aria-label="组织"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Select
                      value={item.type}
                      onChange={(event) =>
                        updateTimeline(item.id, { type: event.target.value as TimelineType })
                      }
                      aria-label="经历类型"
                    >
                      {TIMELINE_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Input
                    value={item.description ?? ''}
                    onChange={(event) =>
                      updateTimeline(item.id, { description: event.target.value })
                    }
                    placeholder="一句描述（可选）"
                    aria-label="经历描述"
                  />
                  <RowActions
                    index={index}
                    length={profile.timeline.length}
                    label="经历"
                    onMove={(from, direction) =>
                      commit((previous) => ({
                        ...previous,
                        timeline: moveItem(previous.timeline, from, direction),
                      }))
                    }
                    onRemove={(removeIndex) =>
                      commit((previous) => ({
                        ...previous,
                        timeline: previous.timeline.filter(
                          (_, itemIndex) => itemIndex !== removeIndex,
                        ),
                      }))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-[10px] border border-dashed border-white/10 px-4 py-6 text-center text-sm text-slate-500">
            还没有经历，点右上角添加。
          </p>
        )}
      </section>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save size={15} />
          保存修改
        </Button>
      </div>
    </div>
  );
}
