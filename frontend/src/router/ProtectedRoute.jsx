import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AuthLoader } from '../components/AuthLoader';

export function ProtectedRoute() {
  const { isAuthenticated, token } = useAuthStore();

  if (!token && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AuthLoader>
      <Outlet />
    </AuthLoader>
  );
}
