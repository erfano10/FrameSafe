import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

type Role = 'PHOTOGRAPHER' | 'CLIENT';

interface ProtectedRouteProps {
  requiredRole?: Role;
}

/**
 * Redirects unauthenticated users to /login.
 * Redirects authenticated users to the wrong role to their own dashboard.
 */
export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Authenticated but wrong role — redirect to their own dashboard
    const destination =
      user?.role === 'PHOTOGRAPHER'
        ? '/photographer/dashboard'
        : user?.role === 'CLIENT'
          ? '/client/dashboard'
          : '/login';
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}

/**
 * Redirects already-authenticated users away from public-only routes
 * (e.g. /login, /register) to their role dashboard.
 */
export function PublicOnlyRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  const destination =
    user?.role === 'PHOTOGRAPHER'
      ? '/photographer/dashboard'
      : user?.role === 'CLIENT'
        ? '/client/dashboard'
        : '/';

  return <Navigate to={destination} replace />;
}
