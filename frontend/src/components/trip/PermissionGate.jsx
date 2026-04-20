import { usePermissions } from '../../hooks/usePermissions';


export function PermissionGate({ require, children, fallback = null }) {
  const permissions = usePermissions();
  return permissions[require] ? <>{children}</> : <>{fallback}</>;
}
