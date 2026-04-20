import { clsx } from 'clsx';


const variantClasses = {
  primary: 'bg-[#1A1A2E] text-white',
  accent: 'bg-[#E94560] text-white',
  success: 'bg-[#10B981]/15 text-[#059669]',
  warning: 'bg-[#F59E0B]/15 text-[#D97706]',
  muted: 'bg-[#F8F9FA] text-[#6B7280] border border-[#E0E0E0]',
  owner: 'bg-[#1A1A2E] text-white',
  editor: 'bg-[#E94560]/15 text-[#E94560]',
  viewer: 'bg-[#6B7280]/15 text-[#6B7280]',
};

export function Badge({ children, variant = 'muted', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function RoleBadge({ role }) {
  const variant = (role === 'owner' ? 'owner' : role === 'editor' ? 'editor' : 'viewer');
  return <Badge variant={variant}>{role}</Badge>;
}
