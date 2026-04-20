import { useState } from 'react';
import { Plus, Plane } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { TripGrid } from '../components/trip/TripGrid';
import { CreateTripModal } from '../components/trip/CreateTripModal';
import { EmptyState } from '../components/ui/EmptyState';
import { useTrips } from '../hooks/useTrip';
import { useAuthStore } from '../store/authStore';

export function DashboardPage() {
  const [showCreate, setShowCreate] = useState(false);
  const { currentUser } = useAuthStore();
  const { data: trips, isLoading } = useTrips();

  // Build member map from populated trip.members (backend populates members.user)
  const memberMap = (trips ?? []).reduce((acc, trip) => {
    acc[trip.id] = trip.members.map((m) => ({
      id: m.userId,
      name: m.user?.name ?? '',
      email: m.user?.email ?? '',
      avatar: m.user?.avatar,
    })).filter((u) => !!u.id);
    return acc;
  }, {});

  const myTrips = (trips ?? []).filter((t) =>
    t.members.some((m) => m.userId === currentUser?.id),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-[#E94560] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Trips"
        subtitle={`${myTrips.length} trip${myTrips.length !== 1 ? 's' : ''} total`}
        action={{
          label: 'New trip',
          onClick: () => setShowCreate(true),
          icon: <Plus className="w-4 h-4" />,
        }}
      />

      {myTrips.length === 0 ? (
        <EmptyState
          icon={<Plane className="w-8 h-8" />}
          title="No trips yet"
          description="Create your first trip and invite friends to start planning together."
          action={{ label: '+ Create your first trip', onClick: () => setShowCreate(true) }}
        />
      ) : (
        <TripGrid
          trips={myTrips}
          currentUserId={currentUser?.id ?? ''}
          memberMap={memberMap}
        />
      )}

      <CreateTripModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
