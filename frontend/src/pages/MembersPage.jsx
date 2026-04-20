import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useTrip, useTripMembers, useInviteMember, useUpdateMemberRole, useRemoveMember } from '../hooks/useTrip';
import { MemberList } from '../components/trip/MemberList';
import { InviteModal } from '../components/trip/InviteModal';
import { PageHeader } from '../components/ui/PageHeader';
import { PermissionGate } from '../components/trip/PermissionGate';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export function MembersPage() {
  const { id } = useParams();
  const { data: trip } = useTrip(id);
  const { data: members } = useTripMembers(trip);
  const [showInvite, setShowInvite] = useState(false);

  const inviteMutation = useInviteMember(id);
  const changeRoleMutation = useUpdateMemberRole(id);
  const removeMutation = useRemoveMember(id);

  const memberUsers = (members ?? []).map((u) => {
    const m = trip?.members.find((tm) => tm.userId === u.id);
    return { user: u, role: m?.role ?? 'viewer' };
  });

  const handleInvite = async (email, role) => {
    await inviteMutation.mutateAsync({ email, role });
    toast.success(`Invite sent to ${email} as ${role}`);
    setShowInvite(false);
  };

  const handleChangeRole = (userId, newRole) => {
    changeRoleMutation.mutate({ userId, role: newRole }, {
      onSuccess: () => toast.success('Role updated'),
    });
  };

  const handleRemove = (userId) => {
    removeMutation.mutate(userId, {
      onSuccess: () => toast.success('Member removed'),
    });
  };

  return (
    <div>
      <PageHeader
        title="Members & Roles"
        subtitle={`${memberUsers.length} member${memberUsers.length !== 1 ? 's' : ''}`}
        action={undefined}
      />

      <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#1A1A2E]">Team</h2>
          <PermissionGate require="canInvite">
            <Button variant="secondary" size="sm" onClick={() => setShowInvite(true)}>
              <UserPlus className="w-3.5 h-3.5" /> Invite
            </Button>
          </PermissionGate>
        </div>
        <MemberList
          members={memberUsers}
          onChangeRole={handleChangeRole}
          onRemove={handleRemove}
        />
      </div>

      <InviteModal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        onInvite={handleInvite}
      />
    </div>
  );
}
