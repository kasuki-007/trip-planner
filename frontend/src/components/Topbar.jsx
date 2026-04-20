import { Bell, Menu } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { Avatar } from './ui/Avatar';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const { currentUser } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-[#E0E0E0] flex items-center px-6 gap-4 shrink-0">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1A2E] transition-colors lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {title && (
        <h1 className="text-lg font-semibold text-[#1A1A2E] truncate flex-1">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-3">
        <button
          className="p-2 rounded-lg text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1A2E] transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E94560]" />
        </button>

        {currentUser && (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-[#F8F9FA] transition-colors"
          >
            <Avatar name={currentUser.name} src={currentUser.avatar} size="sm" />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-[#1A1A2E] leading-none">{currentUser.name}</p>
              <p className="text-xs text-[#6B7280] mt-0.5">{currentUser.email}</p>
            </div>
          </button>
        )}
      </div>
    </header>
  );
}
