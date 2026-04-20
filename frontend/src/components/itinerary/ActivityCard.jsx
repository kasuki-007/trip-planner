import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MessageCircle, MapPin, Clock } from 'lucide-react';
import { ActivityTypeIcon } from './ActivityTypeIcon';
import { formatTime } from '../../utils/formatDate';
import { usePermissions } from '../../hooks/usePermissions';
import { clsx } from 'clsx';


export function ActivityCard({ activity, onCommentClick }) {
  const { canReorder } = usePermissions();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id, disabled: !canReorder });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'bg-white border border-[#E0E0E0] rounded-xl p-3 flex items-start gap-3 group hover:shadow-sm transition-all',
        isDragging && 'opacity-50 shadow-lg z-50',
      )}
    >
      {/* Drag handle */}
      {canReorder && (
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-[#E0E0E0] hover:text-[#6B7280] cursor-grab active:cursor-grabbing shrink-0 touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      )}

      {/* Type icon */}
      <ActivityTypeIcon type={activity.type} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-[#1A1A2E] text-sm leading-tight">{activity.title}</h4>
          {activity.commentCount > 0 && (
            <button
              onClick={onCommentClick}
              className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#E94560] transition-colors shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {activity.commentCount}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs text-[#6B7280]">
            <Clock className="w-3 h-3" />
            {formatTime(activity.time)}
          </span>
          {activity.location && (
            <span className="flex items-center gap-1 text-xs text-[#6B7280] truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{activity.location}</span>
            </span>
          )}
        </div>

        {activity.notes && (
          <p className="text-xs text-[#6B7280] mt-1.5 line-clamp-2">{activity.notes}</p>
        )}
      </div>
    </div>
  );
}
