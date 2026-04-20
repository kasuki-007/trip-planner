import { Button } from './Button';


export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">{title}</h1>
        {subtitle && <p className="text-sm text-[#6B7280] mt-0.5">{subtitle}</p>}
      </div>
      {action && (
        <Button variant="secondary" onClick={action.onClick} className="shrink-0 gap-1.5">
          {action.icon}
          {action.label}
        </Button>
      )}
    </div>
  );
}
