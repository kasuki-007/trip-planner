import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PermissionGate } from '../trip/PermissionGate';



export function AddChecklistItem({ onAdd }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue('');
  };

  return (
    <PermissionGate require="canEdit">
      <form onSubmit={handleSubmit} className="flex gap-2 pt-3 border-t border-[#E0E0E0]">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add item..."
          className="flex-1 px-3 py-1.5 text-sm border border-[#E0E0E0] rounded-lg outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560]"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="p-1.5 rounded-lg bg-[#E94560] text-white disabled:opacity-40 hover:bg-[#d63851] transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </PermissionGate>
  );
}
