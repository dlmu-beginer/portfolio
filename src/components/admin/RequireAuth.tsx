import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../../lib/auth';

export function RequireAuth(): JSX.Element {
  const location = useLocation();

  if (!isLoggedIn()) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/admin/login?redirect=${redirect}`} replace />;
  }

  return <Outlet />;
}
