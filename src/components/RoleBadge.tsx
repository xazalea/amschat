import { Role, ROLE_COLORS, PERMISSIONS, getRolePowerLevel } from '@/types/role';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RoleBadgeProps {
  role: Role;
  size?: 'sm' | 'xs';
}

export function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  const color = ROLE_COLORS[role.color];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    xs: 'text-[10px] px-1.5 py-0.5',
  };

  return (
    <span
      className={`font-medium rounded inline-flex items-center ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${color.hex}20`,
        color: color.hex,
        borderLeft: `3px solid ${color.hex}`,
      }}
    >
      {role.name}
    </span>
  );
}

interface UserRoleBadgesProps {
  roles: Role[];
  maxDisplay?: number;
  size?: 'sm' | 'xs';
}

export function UserRoleBadges({ roles, maxDisplay = 2, size = 'xs' }: UserRoleBadgesProps) {
  if (roles.length === 0) return null;

  const displayRoles = roles.slice(0, maxDisplay);
  const remainingCount = roles.length - maxDisplay;

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {displayRoles.map((role) => (
        <RoleBadge key={role.id} role={role} size={size} />
      ))}
      {remainingCount > 0 && (
        <span className="text-[10px] text-muted-foreground">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}

// Component for displaying a colored username with role tooltip
interface ColoredUsernameProps {
  username: string;
  roles: Role[];
  className?: string;
}

export function ColoredUsername({ username, roles, className = '' }: ColoredUsernameProps) {
  if (roles.length === 0) {
    return <span className={className}>{username}</span>;
  }

  // Get the highest role for color
  const highestRole = roles.reduce((highest, role) => {
    const highestLevel = getRolePowerLevel(highest.permissions);
    const roleLevel = getRolePowerLevel(role.permissions);
    return roleLevel > highestLevel ? role : highest;
  }, roles[0]);

  const color = ROLE_COLORS[highestRole.color];
  
  // Get unique permission names for tooltip
  const allPermissions = [...new Set(roles.flatMap(r => r.permissions))];
  const permissionNames = allPermissions
    .slice(0, 8)
    .map(p => PERMISSIONS[p]?.name || p);
  const remainingPerms = allPermissions.length - 8;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`font-medium cursor-default ${className}`}
            style={{ color: color.hex }}
          >
            {username}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs p-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${color.hex}20`,
                  color: color.hex,
                  borderLeft: `3px solid ${color.hex}`,
                }}
              >
                {highestRole.name}
              </span>
              {roles.length > 1 && (
                <span className="text-[10px] text-muted-foreground">
                  +{roles.length - 1} more role{roles.length > 2 ? 's' : ''}
                </span>
              )}
            </div>
            {permissionNames.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {permissionNames.map((name, i) => (
                  <span key={i} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded">
                    {name}
                  </span>
                ))}
                {remainingPerms > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{remainingPerms} more
                  </span>
                )}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}