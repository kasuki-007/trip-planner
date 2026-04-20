import { Button } from './Button';


export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-[#F8F9FA] flex items-center justify-center text-[#6B7280] mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#6B7280] max-w-sm mb-6">{description}</p>}
      {action && (
        <Button variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
