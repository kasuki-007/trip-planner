import { ChecklistItem } from './ChecklistItem';
import { AddChecklistItem } from './AddChecklistItem';


export function ChecklistProgress({ items }) {
  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1.5">
        <span>{completed} of {total} completed</span>
        <span className="font-semibold text-[#10B981]">{pct}%</span>
      </div>
      <div className="h-2 bg-[#F8F9FA] rounded-full overflow-hidden border border-[#E0E0E0]">
        <div
          className="h-full bg-[#10B981] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ChecklistPanel({ title, items, onToggle, onDelete, onAdd }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
      <h3 className="font-semibold text-[#1A1A2E] mb-3">{title}</h3>
      <ChecklistProgress items={items} />
      <div className="divide-y divide-[#F8F9FA]">
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
      <AddChecklistItem onAdd={onAdd} />
    </div>
  );
}
