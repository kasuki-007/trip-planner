import { Avatar } from '../ui/Avatar';
import { RoleBadge } from '../ui/Badge';
import { PermissionGate } from './PermissionGate';
import { Button } from '../ui/Button';
import { Trash2 } from 'lucide-react';

const ROLES_OPTIONS = ['owner', 'editor', 'viewer'];

export function MemberList({ members, onChangeRole, onRemove }) {
  return (
    <div className="divide-y divide-[#E0E0E0]">
      {members.map(({ user, role }) => (
        <div key={user.id} className="flex items-center gap-3 py-3">
          <Avatar name={user.name} src={user.avatar} size="md" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[#1A1A2E] text-sm truncate">{user.name}</p>
            <p className="text-xs text-[#6B7280] truncate">{user.email}</p>
          </div>
          <PermissionGate
            require="canManageRoles"
            fallback={<RoleBadge role={role} />}
          >
            <select
              value={role}
              onChange={(e) => onChangeRole?.(user.id, e.target.value)}
              className="text-xs border border-[#E0E0E0] rounded-lg px-2 py-1. bg-white outline-none focus:ring-1 focus:ring-[#E94560] cursor-pointer"
            >
              {ROLES_OPTIONS.map((r) => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:bg-red-50 px-2"
              onClick={() => onRemove?.(user.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </PermissionGate>
        </div>
      ))}
    </div>
  );
}
