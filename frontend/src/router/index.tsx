import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import AuthLayout from '@/layouts/AuthLayout';
import PhotographerLayout from '@/layouts/PhotographerLayout';
import ClientLayout from '@/layouts/ClientLayout';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';

// ---------------------------------------------------------------------------
// Skeleton fallback shown while lazy page chunks are loading
// ---------------------------------------------------------------------------
function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-8 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded-lg" />
      <div className="h-4 w-72 bg-slate-100 rounded" />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return function SuspenseWrapper() {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <Component />
      </Suspense>
    );
  };
}

// ---------------------------------------------------------------------------
// Lazy page imports
// ---------------------------------------------------------------------------

// Public
const LandingPage = withSuspense(lazy(() => import('@/pages/LandingPage')));
const LoginPage = withSuspense(lazy(() => import('@/pages/auth/LoginPage')));
const RegisterPhotographerPage = withSuspense(
  lazy(() => import('@/pages/auth/RegisterPhotographerPage'))
);
const RegisterClientPage = withSuspense(lazy(() => import('@/pages/auth/RegisterClientPage')));

// Photographer
const PhotographerDashboard = withSuspense(
  lazy(() => import('@/pages/photographer/PhotographerDashboard'))
);
const AlbumsPage = withSuspense(lazy(() => import('@/pages/photographer/AlbumsPage')));
const AlbumDetailPage = withSuspense(lazy(() => import('@/pages/photographer/AlbumDetailPage')));
const PhotosPage = withSuspense(lazy(() => import('@/pages/photographer/PhotosPage')));
const PaymentsPage = withSuspense(lazy(() => import('@/pages/photographer/PaymentsPage')));
const ProfilePage = withSuspense(lazy(() => import('@/pages/photographer/ProfilePage')));

// Client
const ClientDashboard = withSuspense(lazy(() => import('@/pages/client/ClientDashboard')));
const ClientPurchasesPage = withSuspense(
  lazy(() => import('@/pages/client/ClientPurchasesPage'))
);
const PurchaseDetailPage = withSuspense(
  lazy(() => import('@/pages/client/PurchaseDetailPage'))
);

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
export const router = createBrowserRouter([
  // ── Public landing ──────────────────────────────────────────────────────
  {
    path: '/',
    element: <LandingPage />,
  },

  // ── Auth routes (public only — redirect authenticated users away) ────────
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register/photographer', element: <RegisterPhotographerPage /> },
          { path: '/register/client', element: <RegisterClientPage /> },
        ],
      },
    ],
  },

  // ── Photographer routes ──────────────────────────────────────────────────
  {
    element: <ProtectedRoute requiredRole="PHOTOGRAPHER" />,
    children: [
      {
        path: '/photographer',
        element: <PhotographerLayout />,
        children: [
          { index: true, element: <Navigate to="/photographer/dashboard" replace /> },
          { path: 'dashboard', element: <PhotographerDashboard /> },
          { path: 'albums', element: <AlbumsPage /> },
          { path: 'albums/:id', element: <AlbumDetailPage /> },
          { path: 'photos', element: <PhotosPage /> },
          { path: 'payments', element: <PaymentsPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },

  // ── Client routes ────────────────────────────────────────────────────────
  {
    element: <ProtectedRoute requiredRole="CLIENT" />,
    children: [
      {
        path: '/client',
        element: <ClientLayout />,
        children: [
          { index: true, element: <Navigate to="/client/dashboard" replace /> },
          { path: 'dashboard', element: <ClientDashboard /> },
          { path: 'purchases', element: <ClientPurchasesPage /> },
          { path: 'purchases/:id', element: <PurchaseDetailPage /> },
        ],
      },
    ],
  },

  // ── Catch-all 404 ───────────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
