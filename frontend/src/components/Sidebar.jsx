import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, CheckSquare, Files, DollarSign, Users, Settings,
  LogOut, ChevronLeft, ChevronRight, Plane
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTripStore } from '../store/tripStore';
import { useUIStore } from '../store/uiStore';
import { Avatar } from './ui/Avatar';
import { clsx } from 'clsx';
import { useTrips } from '../hooks/useTrip';
import toast from 'react-hot-toast';

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { currentUser, logout } = useAuthStore();
  const { activeTrip } = useTripStore();
  const { data: trips } = useTrips();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out');
  };

  const tripId = activeTrip?.id;

  const tripLinks = tripId
    ? [
        { to: `/trips/${tripId}`, icon: <Map className="w-4 h-4" />, label: 'Overview' },
        { to: `/trips/${tripId}/itinerary`, icon: <LayoutDashboard className="w-4 h-4" />, label: 'Itinerary' },
        { to: `/trips/${tripId}/checklists`, icon: <CheckSquare className="w-4 h-4" />, label: 'Checklists' },
        { to: `/trips/${tripId}/files`, icon: <Files className="w-4 h-4" />, label: 'Files' },
        { to: `/trips/${tripId}/budget`, icon: <DollarSign className="w-4 h-4" />, label: 'Budget' },
        { to: `/trips/${tripId}/members`, icon: <Users className="w-4 h-4" />, label: 'Members' },
        { to: `/trips/${tripId}/settings`, icon: <Settings className="w-4 h-4" />, label: 'Settings' },
      ]
    : [];

  return (
    <aside
      className={clsx(
        'h-screen bg-[#1A1A2E] text-white flex flex-col transition-all duration-300 shrink-0 relative',
        sidebarOpen ? 'w-64' : 'w-16',
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-xl bg-[#E94560] flex items-center justify-center shrink-0">
          <Plane className="w-4 h-4 text-white" />
        </div>
        {sidebarOpen && (
          <span className="font-bold text-lg tracking-tight">TripSync</span>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin">
        {/* Dashboard */}
        <NavItem to="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" collapsed={!sidebarOpen} />

        {/* Trip switcher */}
        {sidebarOpen && trips && trips.length > 0 && (
          <div className="mt-4 mb-2 px-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Trips</p>
            <div className="mt-1 space-y-0.5">
              {trips.map((t) => (
                <button
                  key={t.id}
                  onClick={() => navigate(`/trips/${t.id}`)}
                  className={clsx(
                    'w-full text-left px-3 py-2 rounded-lg text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors truncate',
                    activeTrip?.id === t.id && 'bg-white/10 text-white',
                  )}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trip links */}
        {tripLinks.length > 0 && (
          <div className={clsx('mt-2', sidebarOpen && 'border-t border-white/10 pt-3')}>
            {sidebarOpen && (
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 px-2 mb-1">
                {activeTrip?.title}
              </p>
            )}
            {tripLinks.map((link) => (
              <NavItem key={link.to} to={link.to} icon={link.icon} label={link.label} collapsed={!sidebarOpen} />
            ))}
          </div>
        )}
      </nav>

      {/* User & logout */}
      <div className="border-t border-white/10 p-3 space-y-1">
        <NavItem to="/profile" icon={
          currentUser ? (
            <Avatar name={currentUser.name} src={currentUser.avatar} size="xs" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-white/20" />
          )
        } label={currentUser?.name ?? 'Profile'} collapsed={!sidebarOpen} />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {sidebarOpen && <span className="text-sm">Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#E94560] text-white flex items-center justify-center shadow-md z-10 hover:bg-[#d63851]"
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
    </aside>
  );
}


function NavItem({ to, icon, label, collapsed }) {
  return (
    <NavLink
      to={to}
      end={to === '/dashboard'}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
          isActive
            ? 'bg-[#E94560] text-white'
            : 'text-white/60 hover:bg-white/10 hover:text-white',
        )
      }
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}
