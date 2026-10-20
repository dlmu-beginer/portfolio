import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';
import { RequireAuth } from './components/admin/RequireAuth';
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AdminLayout = lazy(() =>
  import('./components/admin/AdminLayout').then((module) => ({ default: module.AdminLayout })),
);
const LoginPage = lazy(() =>
  import('./pages/admin/LoginPage').then((module) => ({ default: module.LoginPage })),
);
const DashboardPage = lazy(() =>
  import('./pages/admin/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const ProfileAdminPage = lazy(() =>
  import('./pages/admin/ProfileAdminPage').then((module) => ({
    default: module.ProfileAdminPage,
  })),
);
const ProjectsAdminPage = lazy(() =>
  import('./pages/admin/ProjectsAdminPage').then((module) => ({
    default: module.ProjectsAdminPage,
  })),
);
const ProjectEditPage = lazy(() =>
  import('./pages/admin/ProjectEditPage').then((module) => ({ default: module.ProjectEditPage })),
);
const PostsAdminPage = lazy(() =>
  import('./pages/admin/PostsAdminPage').then((module) => ({ default: module.PostsAdminPage })),
);
const PostEditPage = lazy(() =>
  import('./pages/admin/PostEditPage').then((module) => ({ default: module.PostEditPage })),
);

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projects/:slug', element: <ProjectDetailPage /> },
      { path: 'blog/:slug', element: <PostDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: 'admin/login',
    element: <LoginPage />,
  },
  {
    path: 'admin',
    element: <RequireAuth />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'profile', element: <ProfileAdminPage /> },
          { path: 'projects', element: <ProjectsAdminPage /> },
          { path: 'projects/new', element: <ProjectEditPage /> },
          { path: 'projects/:id/edit', element: <ProjectEditPage /> },
          { path: 'posts', element: <PostsAdminPage /> },
          { path: 'posts/new', element: <PostEditPage /> },
          { path: 'posts/:id/edit', element: <PostEditPage /> },
        ],
      },
    ],
  },
]);
