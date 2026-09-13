import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PublicLayout from '../layouts/PublicLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import ProtectedRoute from '../routes/ProtectedRoute.jsx';
import LoadingScreen from '../components/common/LoadingScreen.jsx';
import { PUBLIC_ROUTES, ADMIN_ROUTES } from '../constants/routes.js';

// Public Lazy Imports
const HomePage = lazy(() => import('../pages/public/HomePage.jsx'));
const ProjectsPage = lazy(() => import('../pages/public/ProjectsPage.jsx'));
const ProjectDetailPage = lazy(() => import('../pages/public/ProjectDetailPage.jsx'));
const BlogPage = lazy(() => import('../pages/public/BlogPage.jsx'));
const BlogPostPage = lazy(() => import('../pages/public/BlogPostPage.jsx'));
const ResumePage = lazy(() => import('../pages/public/ResumePage.jsx'));
const ContactPage = lazy(() => import('../pages/public/ContactPage.jsx'));
const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage.jsx'));

// Admin Lazy Imports
const LoginPage = lazy(() => import('../pages/admin/LoginPage.jsx'));
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage.jsx'));
const ProfilePage = lazy(() => import('../pages/admin/ProfilePage.jsx'));
const AdminResumePage = lazy(() => import('../pages/admin/ResumePage.jsx'));
const AdminProjectsPage = lazy(() => import('../pages/admin/ProjectsPage.jsx'));
const ProjectFormPage = lazy(() => import('../pages/admin/ProjectFormPage.jsx'));
const SkillsPage = lazy(() => import('../pages/admin/SkillsPage.jsx'));
const ExperiencePage = lazy(() => import('../pages/admin/ExperiencePage.jsx'));
const EducationPage = lazy(() => import('../pages/admin/EducationPage.jsx'));
const CertificationsPage = lazy(() => import('../pages/admin/CertificationsPage.jsx'));
const TestimonialsPage = lazy(() => import('../pages/admin/TestimonialsPage.jsx'));
const MessagesPage = lazy(() => import('../pages/admin/MessagesPage.jsx'));
const MediaPage = lazy(() => import('../pages/admin/MediaPage.jsx'));
const AdminBlogPage = lazy(() => import('../pages/admin/BlogPage.jsx'));
const BlogFormPage = lazy(() => import('../pages/admin/BlogFormPage.jsx'));
const SettingsPage = lazy(() => import('../pages/admin/SettingsPage.jsx'));
const SEOPage = lazy(() => import('../pages/admin/SEOPage.jsx'));
const AnalyticsPage = lazy(() => import('../pages/admin/AnalyticsPage.jsx'));
const ActivityPage = lazy(() => import('../pages/admin/ActivityPage.jsx'));
const PreviewPage = lazy(() => import('../pages/admin/PreviewPage.jsx'));
const AdminNotFoundPage = lazy(() => import('../pages/admin/AdminNotFoundPage.jsx'));

const router = createBrowserRouter([
  // Admin Login routes
  {
    path: ADMIN_ROUTES.LOGIN,
    element: <Suspense fallback={<LoadingScreen />}><LoginPage /></Suspense>
  },
  {
    path: '/login',
    element: <Suspense fallback={<LoadingScreen />}><LoginPage /></Suspense>
  },

  // Protected Admin CMS routes
  {
    path: '/admin',
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

  // Public Website routes
  {
    path: PUBLIC_ROUTES.HOME,
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
]);

export default router;