import { Hotel, Plane, UtensilsCrossed, Car, HelpCircle, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { PermissionGate } from '../trip/PermissionGate';
import { clsx } from 'clsx';

const typeConfig = {
  hotel: { icon: <Hotel className="w-4 h-4" />, color: 'bg-indigo-100 text-indigo-600', label: 'Hotel' },
  flight: { icon: <Plane className="w-4 h-4" />, color: 'bg-sky-100 text-sky-600', label: 'Flight' },
  restaurant: { icon: <UtensilsCrossed className="w-4 h-4" />, color: 'bg-orange-100 text-orange-600', label: 'Restaurant' },
  car: { icon: <Car className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-600', label: 'Car' },
  other: { icon: <HelpCircle className="w-4 h-4" />, color: 'bg-gray-100 text-gray-500', label: 'Other' },
};


export function ReservationCard({ reservation, onDelete }) {
  const config = typeConfig[reservation.type] ?? typeConfig.other;

  return (
    <div className="flex items-start gap-3 p-4 bg-white border border-[#E0E0E0] rounded-xl hover:shadow-sm transition-all group">
      <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', config.color)}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-[#1A1A2E] text-sm">{reservation.name}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Ref: <span className="font-mono text-[#E94560]">{reservation.bookingRef}</span>
            </p>
          </div>
          <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', config.color)}>
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-[#6B7280]">
          <span>{formatDate(reservation.checkIn)}</span>
          {reservation.checkOut && (
            <>
              <span>→</span>
              <span>{formatDate(reservation.checkOut)}</span>
            </>
          )}
        </div>
        {reservation.notes && (
          <p className="text-xs text-[#6B7280] mt-1">{reservation.notes}</p>
        )}
      </div>
      <PermissionGate require="canEdit">
        <button
          onClick={() => onDelete?.(reservation.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#6B7280] hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </PermissionGate>
    </div>
  );
}
