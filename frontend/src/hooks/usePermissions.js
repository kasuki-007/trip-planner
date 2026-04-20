import { useAuthStore } from '../store/authStore';
import { useTripStore } from '../store/tripStore';
import { ROLES } from '../constants/roles';


export function usePermissions() {
  const { currentUser } = useAuthStore();
  const { userRole } = useTripStore();

  const role = userRole;
  const isOwner = role === ROLES.OWNER;
  const isEditor = role === ROLES.EDITOR;
  const isViewer = role === ROLES.VIEWER;

  return {
    role,
    isOwner,
    isEditor,
    isViewer,
    canEdit: isOwner || isEditor,
    canInvite: isOwner,
    canManageRoles: isOwner,
    canDeleteTrip: isOwner,
    canAddExpense: isOwner || isEditor,
    canUploadFiles: isOwner || isEditor,
    canComment: isOwner || isEditor,
    canReorder: isOwner || isEditor,
  };

  void currentUser; // used implicitly via store
}
