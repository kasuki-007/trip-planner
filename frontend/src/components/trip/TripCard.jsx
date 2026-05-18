import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { RoleBadge } from '../ui/Badge';
import { AvatarGroup } from '../ui/Avatar';
import { formatDateShort, tripDuration } from '../../utils/formatDate';



export function TripCard({ trip, userRole, members }) {
  const navigate = useNavigate();
  const duration = tripDuration(trip.startDate, trip.endDate);

  return (
    <div
      onClick={() => navigate(`/trips/${trip.id}`)}
      className="bg-white rounded-2xl overflow-hidden border border-[#E0E0E0] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
    >
      {/* Cover image */}
      <div className="relative h-40 bg-linear-to-br from-[#1A1A2E] to-[#16213E] overflow-hidden">
        {trip.coverImage && (
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <h3 className="font-bold text-white text-lg leading-tight">{trip.title}</h3>
          <RoleBadge role={userRole} />
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{trip.destination}</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>
            {formatDateShort(trip.startDate)} – {formatDateShort(trip.endDate)}
            <span className="ml-1.5 text-xs text-[#E94560] font-medium">({duration}d)</span>
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <AvatarGroup
              users={members.map((m) => ({ id: m.id, name: m.name, src: m.avatar }))}
              size="xs"
              max={4}
            />
            <span className="text-xs text-[#6B7280]">
              <Users className="w-3 h-3 inline mr-0.5" />
              {trip.members.length}
            </span>
          </div>
          {trip.budget && (
            <span className="text-xs font-semibold text-[#10B981]">
              ₹{trip.budget.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
