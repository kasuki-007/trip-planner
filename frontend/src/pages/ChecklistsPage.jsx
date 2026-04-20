import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { ChecklistPanel } from '../components/checklist/ChecklistPanel';
import {
  useChecklists,
  useToggleChecklistItem,
  useAddChecklistItem,
  useDeleteChecklistItem,
} from '../hooks/useChecklists';
import toast from 'react-hot-toast';

export function ChecklistsPage() {
  const { id } = useParam();
  const { data, isLoading } = useChecklists(id);
  const { mutateAsync: toggle } = useToggleChecklistItem(id);
  const { mutateAsync: addItem } = useAddChecklistItem(id);
  const { mutateAsync: deleteItem } = useDeleteChecklistItem(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E94560] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const packing = data?.packing;
  const todo = data?.todo;

  const makeToggleHandler = (listType, items) =>
    (itemId) => {
      const item = items.find((i) => i.id === itemId);
      toggle({ listType, itemId, completed: !(item?.completed ?? false) });
    };

  return (
    <div>
      <PageHeader title="Checklists" subtitle="Packing list & to-dos" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {packing && (
          <ChecklistPanel
            title="🎒 Packing List"
            items={packing.items}
            onToggle={makeToggleHandler('packing', packing.items)}
            onDelete={(itemId) => {
              deleteItem({ listType: 'packing', itemId });
              toast.success('Item removed');
            }}
            onAdd={(label) => {
              addItem({ listType: 'packing', label });
              toast.success('Item added');
            }}
          />
        )}

        {todo && (
          <ChecklistPanel
            title="✅ To-Do List"
            items={todo.items}
            onToggle={makeToggleHandler('todo', todo.items)}
            onDelete={(itemId) => {
              deleteItem({ listType: 'todo', itemId });
              toast.success('Item removed');
            }}
            onAdd={(label) => {
              addItem({ listType: 'todo', label });
              toast.success('Item added');
            }}
          />
        )}
      </div>
    </div>
  );
}
