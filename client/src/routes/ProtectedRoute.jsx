import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import LoadingScreen from '../components/common/LoadingScreen.jsx';
import { ADMIN_ROUTES } from '../constants/routes.js';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, accessToken, isLoading, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Only verify with server if an active in-memory session token exists
    if (!isAuthenticated && accessToken) {
      checkAuth().catch(() => {});
    }
  }, [isAuthenticated, accessToken, checkAuth]);

  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ADMIN_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
}