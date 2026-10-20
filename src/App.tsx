import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ToastProvider } from './context/ToastContext';

export function App(): JSX.Element {
  return (
    <ToastProvider>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
            加载中…
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </ToastProvider>
  );
}
