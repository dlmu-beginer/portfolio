import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { cn } from '../lib/cn';

type ToastTone = 'success' | 'error';

interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  showToast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const VISIBLE_MS = 2600;

interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

function ToastViewport({ toasts, onDismiss }: ToastViewportProps): JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-[10px] border px-4 py-3 text-sm shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]',
            toast.tone === 'success'
              ? 'border-emerald-400/25 bg-[#0E1A17] text-emerald-200'
              : 'border-rose-400/25 bg-[#1A1014] text-rose-200',
          )}
        >
          {toast.tone === 'success' ? (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
          )}
          <p className="flex-1 leading-5">{toast.message}</p>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="关闭提示"
            className="focus-ring rounded opacity-60 transition hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps): JSX.Element {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<number[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((previous) => previous.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((previous) => [...previous.slice(-2), { id, message, tone }]);
    const timer = window.setTimeout(() => {
      setToasts((previous) => previous.filter((item) => item.id !== id));
    }, VISIBLE_MS);
    timers.current.push(timer);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast 必须在 ToastProvider 内使用');
  return context;
}
