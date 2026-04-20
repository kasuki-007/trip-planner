import { TripCard } from './TripCard';


export function TripGrid({ trips, currentUserId, memberMap }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {trips.map((trip) => {
        const userMember = trip.members.find((m) => m.userId === currentUserId);
        const role = userMember?.role ?? 'viewer';
        const members = memberMap[trip.id] ?? [];
        return <TripCard key={trip.id} trip={trip} userRole={role} members={members} />;
      })}
    </div>
  );
}
