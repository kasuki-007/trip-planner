import { Trash2 } from 'lucide-react';
import { PermissionGate } from '../trip/PermissionGate';
import { clsx } from 'clsx';


export function ChecklistItem({ item, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-3 py-2.5 group">
      <button
        onClick={() => onToggle(item.id)}
        className={clsx(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
          item.completed
            ? 'bg-[#10B981] border-[#10B981]'
            : 'border-[#E0E0E0] hover:border-[#E94560]',
        )}
        aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {item.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span
        className={clsx(
          'flex-1 text-sm transition-all',
          item.completed ? 'line-through text-[#6B7280]' : 'text-[#1A1A2E]',
        )}
      >
        {item.label}
      </span>

      <PermissionGate require="canEdit">
        <button
          onClick={() => onDelete(item.id)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded text-[#6B7280] hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </PermissionGate>
    </div>
  );
}
