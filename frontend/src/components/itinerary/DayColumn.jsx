import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ActivityCard } from './ActivityCard';
import { AddActivityForm } from './AddActivityForm';
import { formatDate } from '../../utils/formatDate';
import { PermissionGate } from '../trip/PermissionGate';


export function DayColumn({ day, onAddActivity, onCommentClick }) {
  const sorted = [...day.activities].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] flex flex-col min-w-72 w-72">
      {/* Day header */}
      <div className="px-4 py-3 border-b border-[#E0E0E0]">
        <h3 className="font-semibold text-[#1A1A2E] text-sm">{day.label ?? formatDate(day.date, 'EEEE, MMM d')}</h3>
        <p className="text-xs text-[#6B7280]">{formatDate(day.date)}</p>
      </div>

      {/* Activities */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        <SortableContext items={sorted.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {sorted.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onCommentClick={() => onCommentClick?.(activity)}
            />
          ))}
        </SortableContext>
      </div>

      {/* Add activity */}
      <div className="p-3 border-t border-[#E0E0E0]">
        <PermissionGate require="canEdit">
          <AddActivityForm
            dayId={day.id}
            onAdd={(data) => onAddActivity(day.id, data)}
          />
        </PermissionGate>
      </div>
    </div>
  );
}
