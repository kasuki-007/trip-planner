import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';


export function AuthLoader({ children }) {
  const { token, login, logout, isAuthenticated } = useAuthStore();
  const [checking, setChecking] = useState(!!token && !isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }
    if (isAuthenticated) {
      setChecking(false);
      return;
    }

    // Token exists but user not in store — rehydrate
    authService.getMe()
      .then((user) => {
        const normalized = { id: (user)._id ?? (user).id, name: user.name, email: user.email, avatar: user.avatar };
        login(normalized, token);
      })
      .catch(() => {
        logout();
        navigate('/login', { replace: true });
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F1117]">
        <div className="w-8 h-8 border-4 border-[#E94560] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
