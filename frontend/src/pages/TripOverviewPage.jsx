import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, Map, CheckSquare, Files, Settings, UserPlus } from 'lucide-react';
import { useTrip, useTripMembers } from '../hooks/useTrip';
import { useTripStore } from '../store/tripStore';
import { useAuthStore } from '../store/authStore';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge, RoleBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { formatDate, tripDuration } from '../utils/formatDate';
import { formatCurrency } from '../utils/calculateSplit';
import { clsx } from 'clsx';

export function TripOverviewPage() {
  const { id } = useParams();
  const { data: trip, isLoading } = useTrip(id);
  const { data: members } = useTripMembers(trip);
  const { setActiveTrip } = useTripStore();
  const { currentUser } = useAuthStore();

  useEffect(() => {
    if (trip && currentUser) {
      const myMember = trip.members.find((m) => m.userId === currentUser.id);
      setActiveTrip(trip, myMember?.role ?? null);
    }
  }, [trip, currentUser, setActiveTrip]);

  if (isLoading || !trip) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E94560] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const myMember = trip.members.find((m) => m.userId === currentUser?.id);
  const memberUsers = (members ?? []).map((u) => {
    const member = trip.members.find((m) => m.userId === u.id);
    return { user: u, role: member?.role ?? 'viewer' };
  });

  const quickLinks = [
    { to: `/trips/${id}/itinerary`, icon: <Map className="w-5 h-5" />, label: 'Itinerary', color: 'bg-indigo-50 text-indigo-600' },
    { to: `/trips/${id}/checklists`, icon: <CheckSquare className="w-5 h-5" />, label: 'Checklists', color: 'bg-emerald-50 text-emerald-600' },
    { to: `/trips/${id}/files`, icon: <Files className="w-5 h-5" />, label: 'Files', color: 'bg-amber-50 text-amber-600' },
    { to: `/trips/${id}/budget`, icon: <DollarSign className="w-5 h-5" />, label: 'Budget', color: 'bg-rose-50 text-rose-600' },
    { to: `/trips/${id}/members`, icon: <Users className="w-5 h-5" />, label: 'Members', color: 'bg-sky-50 text-sky-600' },
    { to: `/trips/${id}/settings`, icon: <Settings className="w-5 h-5" />, label: 'Settings', color: 'bg-gray-50 text-gray-600' },
  ];

  return (
    <div>
      <PageHeader
        title={trip.title}
        subtitle={trip.destination}
      />

      {/* Hero */}
      <div className="relative h-52 rounded-2xl overflow-hidden mb-6 bg-linear-to-br from-[#1A1A2E] to-[#16213E]">
        {trip.coverImage && (
          <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
          <div>
            <p className="text-white/80 text-sm flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {trip.destination}
            </p>
            <p className="text-white text-sm flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
              <span className="ml-1 text-xs text-[#E94560] font-semibold">
                ({tripDuration(trip.startDate, trip.endDate)} days)
              </span>
            </p>
          </div>
          {myMember && <RoleBadge role={myMember.role} />}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Duration', value: `${tripDuration(trip.startDate, trip.endDate)} days`, icon: <Calendar className="w-4 h-4" /> },
          { label: 'Members', value: trip.members.length, icon: <Users className="w-4 h-4" /> },
          { label: 'Budget', value: trip.budget ? formatCurrency(trip.budget, trip.currency) : 'N/A', icon: <DollarSign className="w-4 h-4" /> },
          { label: 'Role', value: myMember?.role ?? 'viewer', icon: <Badge variant="muted" className="text-xs!">{myMember?.role ?? 'viewer'}</Badge> },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-[#E0E0E0]">
            <p className="text-xs text-[#6B7280] mb-1">{stat.label}</p>
            <p className="font-bold text-[#1A1A2E] text-lg">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-[#E0E0E0] hover:shadow-md hover:-translate-y-0.5 transition-all text-center"
          >
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', link.color)}>
              {link.icon}
            </div>
            <span className="text-xs font-medium text-[#1A1A2E]">{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Members */}
      <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#1A1A2E]">Members</h2>
          <Link
            to={`/trips/${id}/members`}
            className="text-sm text-[#E94560] hover:underline flex items-center gap-1"
          >
            <UserPlus className="w-3.5 h-3.5" /> Manage
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {memberUsers.map(({ user, role }) => (
            <div key={user.id} className="flex items-center gap-2 bg-[#F8F9FA] rounded-xl px-3 py-2">
              <Avatar name={user.name} src={user.avatar} size="sm" />
              <div>
                <p className="text-sm font-medium text-[#1A1A2E]">{user.name}</p>
                <RoleBadge role={role} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
