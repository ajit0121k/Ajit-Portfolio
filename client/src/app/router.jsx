import { createBrowserRouter, Navigate, useRouteError } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import PublicLayout from '../layouts/PublicLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import ProtectedRoute from '../routes/ProtectedRoute.jsx';
import LoadingScreen from '../components/common/LoadingScreen.jsx';
import { PUBLIC_ROUTES, ADMIN_ROUTES } from '../constants/routes.js';

const isAdminOnly = 
  typeof window !== 'undefined' && 
  window.location.pathname.toLowerCase().includes('portfolio-admin');

/**
 * Resilient lazy loader that automatically recovers from stale chunk errors when a new version deploys
 */
function lazyWithRetry(componentImport) {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.warn('Dynamic import chunk failed. Checking if update occurred...', error);
      const isChunkError = 
        error?.message?.includes('dynamically imported module') ||
        error?.message?.includes('Failed to fetch') ||
        error?.name === 'TypeError';

      if (isChunkError && typeof window !== 'undefined') {
        const lastReload = sessionStorage.getItem('vite_chunk_retry');
        const now = Date.now();
        if (!lastReload || now - parseInt(lastReload, 10) > 4000) {
          sessionStorage.setItem('vite_chunk_retry', String(now));
          window.location.reload();
          return new Promise(() => {}); // Wait for reload
        }
      }
      throw error;
    }
  });
}

/**
 * Graceful Error Boundary for Router
 */
function RouteErrorBoundary() {
  const error = useRouteError();
  const isChunkError = 
    error?.message?.includes('dynamically imported module') ||
    error?.message?.includes('Failed to fetch');

  useEffect(() => {
    if (isChunkError) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isChunkError]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white/80 dark:bg-[#101b13]/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-8 rounded-3xl shadow-2xl space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          {isChunkError ? <RefreshCw className="w-7 h-7 animate-spin" /> : <AlertTriangle className="w-7 h-7" />}
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          {isChunkError ? 'Updating to Latest Version...' : 'Unable to Load Section'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {isChunkError
            ? 'A new build was deployed. Refreshing your dashboard now to load the latest modules...'
            : (error?.message || 'An unexpected error occurred while loading this view.')}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-md cursor-pointer"
        >
          Refresh Now
        </button>
      </div>
    </div>
  );
}

// Public Lazy Imports with Auto-Retry
const HomePage = lazyWithRetry(() => import('../pages/public/HomePage.jsx'));
const ProjectsPage = lazyWithRetry(() => import('../pages/public/ProjectsPage.jsx'));
const ProjectDetailPage = lazyWithRetry(() => import('../pages/public/ProjectDetailPage.jsx'));
const BlogPage = lazyWithRetry(() => import('../pages/public/BlogPage.jsx'));
const BlogPostPage = lazyWithRetry(() => import('../pages/public/BlogPostPage.jsx'));
const ResumePage = lazyWithRetry(() => import('../pages/public/ResumePage.jsx'));
const ContactPage = lazyWithRetry(() => import('../pages/public/ContactPage.jsx'));
const NotFoundPage = lazyWithRetry(() => import('../pages/public/NotFoundPage.jsx'));

// Admin Lazy Imports with Auto-Retry
const LoginPage = lazyWithRetry(() => import('../pages/admin/LoginPage.jsx'));
const DashboardPage = lazyWithRetry(() => import('../pages/admin/DashboardPage.jsx'));
const ProfilePage = lazyWithRetry(() => import('../pages/admin/ProfilePage.jsx'));
const AdminResumePage = lazyWithRetry(() => import('../pages/admin/ResumePage.jsx'));
const AdminProjectsPage = lazyWithRetry(() => import('../pages/admin/ProjectsPage.jsx'));
const ProjectFormPage = lazyWithRetry(() => import('../pages/admin/ProjectFormPage.jsx'));
const SkillsPage = lazyWithRetry(() => import('../pages/admin/SkillsPage.jsx'));
const ExperiencePage = lazyWithRetry(() => import('../pages/admin/ExperiencePage.jsx'));
const EducationPage = lazyWithRetry(() => import('../pages/admin/EducationPage.jsx'));
const CertificationsPage = lazyWithRetry(() => import('../pages/admin/CertificationsPage.jsx'));
const TestimonialsPage = lazyWithRetry(() => import('../pages/admin/TestimonialsPage.jsx'));
const MessagesPage = lazyWithRetry(() => import('../pages/admin/MessagesPage.jsx'));
const MediaPage = lazyWithRetry(() => import('../pages/admin/MediaPage.jsx'));
const AdminBlogPage = lazyWithRetry(() => import('../pages/admin/BlogPage.jsx'));
const BlogFormPage = lazyWithRetry(() => import('../pages/admin/BlogFormPage.jsx'));
const SettingsPage = lazyWithRetry(() => import('../pages/admin/SettingsPage.jsx'));
const SEOPage = lazyWithRetry(() => import('../pages/admin/SEOPage.jsx'));
const AnalyticsPage = lazyWithRetry(() => import('../pages/admin/AnalyticsPage.jsx'));
const ActivityPage = lazyWithRetry(() => import('../pages/admin/ActivityPage.jsx'));
const PreviewPage = lazyWithRetry(() => import('../pages/admin/PreviewPage.jsx'));
const AdminNotFoundPage = lazyWithRetry(() => import('../pages/admin/AdminNotFoundPage.jsx'));

const router = createBrowserRouter([
  // Admin Login routes
  {
    path: ADMIN_ROUTES.LOGIN,
    errorElement: <RouteErrorBoundary />,
    element: <Suspense fallback={<LoadingScreen />}><LoginPage /></Suspense>
  },
  {
    path: '/login',
    errorElement: <RouteErrorBoundary />,
    element: <Suspense fallback={<LoadingScreen />}><LoginPage /></Suspense>
  },

  // Protected Admin CMS routes
  {
    path: '/admin',
    errorElement: <RouteErrorBoundary />,
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<LoadingScreen />}><DashboardPage /></Suspense> },
      { path: 'dashboard', element: <Suspense fallback={<LoadingScreen />}><DashboardPage /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<LoadingScreen />}><ProfilePage /></Suspense> },
      { path: 'resume', element: <Suspense fallback={<LoadingScreen />}><AdminResumePage /></Suspense> },
      { path: 'projects', element: <Suspense fallback={<LoadingScreen />}><AdminProjectsPage /></Suspense> },
      { path: 'projects/new', element: <Suspense fallback={<LoadingScreen />}><ProjectFormPage /></Suspense> },
      { path: 'projects/:id/edit', element: <Suspense fallback={<LoadingScreen />}><ProjectFormPage /></Suspense> },
      { path: 'skills', element: <Suspense fallback={<LoadingScreen />}><SkillsPage /></Suspense> },
      { path: 'experience', element: <Suspense fallback={<LoadingScreen />}><ExperiencePage /></Suspense> },
      { path: 'education', element: <Suspense fallback={<LoadingScreen />}><EducationPage /></Suspense> },
      { path: 'certifications', element: <Suspense fallback={<LoadingScreen />}><CertificationsPage /></Suspense> },
      { path: 'testimonials', element: <Suspense fallback={<LoadingScreen />}><TestimonialsPage /></Suspense> },
      { path: 'messages', element: <Suspense fallback={<LoadingScreen />}><MessagesPage /></Suspense> },
      { path: 'media', element: <Suspense fallback={<LoadingScreen />}><MediaPage /></Suspense> },
      { path: 'blog', element: <Suspense fallback={<LoadingScreen />}><AdminBlogPage /></Suspense> },
      { path: 'blog/new', element: <Suspense fallback={<LoadingScreen />}><BlogFormPage /></Suspense> },
      { path: 'blog/:id/edit', element: <Suspense fallback={<LoadingScreen />}><BlogFormPage /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<LoadingScreen />}><SettingsPage /></Suspense> },
      { path: 'seo', element: <Suspense fallback={<LoadingScreen />}><SEOPage /></Suspense> },
      { path: 'analytics', element: <Suspense fallback={<LoadingScreen />}><AnalyticsPage /></Suspense> },
      { path: 'activity', element: <Suspense fallback={<LoadingScreen />}><ActivityPage /></Suspense> },
      { path: 'preview', element: <Suspense fallback={<LoadingScreen />}><PreviewPage /></Suspense> },
      { path: '*', element: <Suspense fallback={<LoadingScreen />}><AdminNotFoundPage /></Suspense> }
    ]
  },

  // Public Website routes or Standalone Admin Redirect
  ...(isAdminOnly
    ? [
        { path: '/', element: <Navigate to={ADMIN_ROUTES.LOGIN} replace /> },
        { path: '*', element: <Navigate to={ADMIN_ROUTES.LOGIN} replace /> }
      ]
    : [
        {
          path: PUBLIC_ROUTES.HOME,
          errorElement: <RouteErrorBoundary />,
          element: <PublicLayout />,
          children: [
            { index: true, element: <Suspense fallback={<LoadingScreen />}><HomePage /></Suspense> },
            { path: PUBLIC_ROUTES.PROJECTS.slice(1), element: <Suspense fallback={<LoadingScreen />}><ProjectsPage /></Suspense> },
            { path: PUBLIC_ROUTES.PROJECT_DETAIL.slice(1), element: <Suspense fallback={<LoadingScreen />}><ProjectDetailPage /></Suspense> },
            { path: PUBLIC_ROUTES.BLOG.slice(1), element: <Suspense fallback={<LoadingScreen />}><BlogPage /></Suspense> },
            { path: PUBLIC_ROUTES.BLOG_POST.slice(1), element: <Suspense fallback={<LoadingScreen />}><BlogPostPage /></Suspense> },
            { path: PUBLIC_ROUTES.RESUME.slice(1), element: <Suspense fallback={<LoadingScreen />}><ResumePage /></Suspense> },
            { path: PUBLIC_ROUTES.CONTACT.slice(1), element: <Suspense fallback={<LoadingScreen />}><ContactPage /></Suspense> },
            { path: '*', element: <Suspense fallback={<LoadingScreen />}><NotFoundPage /></Suspense> }
          ]
        }
      ])
], {
  basename: import.meta.env.BASE_URL,
});

export default router;