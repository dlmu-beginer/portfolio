import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react';
import { isLoggedIn, login } from '../../lib/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FormField } from '../../components/admin/FormField';
import { useToast } from '../../context/ToastContext';

export function LoginPage(): JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { showToast } = useToast();

  if (isLoggedIn()) return <Navigate to="/admin" replace />;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!login(username, password)) {
      setError('账号或密码错误');
      return;
    }
    const redirect = params.get('redirect');
    showToast('登录成功');
    navigate(redirect && redirect.startsWith('/') ? redirect : '/admin', { replace: true });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div className="aurora-bg pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative w-full max-w-sm">
        <Link
          to="/"
          className="focus-ring mb-6 inline-flex items-center gap-1.5 rounded text-xs text-slate-500 transition hover:text-slate-200"
        >
          <ArrowLeft size={14} />
          返回前台
        </Link>

        <div className="card-surface p-7">
          <p className="font-mono text-[10px] tracking-[0.3em] text-accent">// ADMIN</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">后台登录</h1>
          <p className="mt-2 text-sm text-slate-400">管理项目、文章与个人信息。</p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
            <FormField label="账号" htmlFor="login-username" required>
              <Input
                id="login-username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setError('');
                }}
                autoComplete="username"
                placeholder="admin"
              />
            </FormField>

            <FormField label="密码" htmlFor="login-password" required>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError('');
                  }}
                  autoComplete="current-password"
                  placeholder="••••••"
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                  className="focus-ring absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:text-white"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </FormField>

            {error ? (
              <p className="rounded-[10px] border border-rose-400/20 bg-rose-400/[0.07] px-3 py-2 text-xs text-rose-300">
                {error}
              </p>
            ) : null}

            <Button type="submit" size="lg" className="w-full">
              登录
              <LogIn size={15} />
            </Button>
          </form>

          <div className="mt-6 rounded-[10px] border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-slate-400">
            演示账号：<span className="font-mono text-slate-200">admin</span> /{' '}
            <span className="font-mono text-slate-200">123456</span>
          </div>
        </div>

        <p className="mt-5 text-center text-[11px] text-slate-600">
          数据只保存在当前浏览器本地，不会上传。
        </p>
      </div>
    </div>
  );
}
