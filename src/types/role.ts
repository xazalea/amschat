// Permission definitions with power levels 1-5 and difficulty tiers
// Difficulty affects poll approval requirements
export type PermissionDifficulty = 1 | 2 | 3 | 4 | 5; // Tier 1-5

export interface PermissionDefinition {
  name: string;
  level: number;
  description: string;
  category: string;
  difficulty: PermissionDifficulty; // Affects poll approval % needed
}

export const DIFFICULTY_CONFIG: Record<PermissionDifficulty, { approvalPercent: number; label: string; description: string }> = {
  1: { approvalPercent: 50, label: 'Easy', description: '50% approval needed' },
  2: { approvalPercent: 60, label: 'Medium', description: '60% approval needed' },
  3: { approvalPercent: 75, label: 'Hard', description: '75% approval needed' },
  4: { approvalPercent: 85, label: 'Very Hard', description: '85% approval needed' },
  5: { approvalPercent: 90, label: 'Extreme', description: '90% approval needed' },
};

// Only permissions that are actually role-exclusive (not default behavior)
// Default behavior (everyone can do): send messages, images, gifs, links, reactions, emojis, edit own messages, etc.
export const PERMISSIONS = {
  // Level 2 - Intermediate (Tier 2 difficulty - 60% approval)
  slow_mode_immunity: { name: 'Slow Mode Immunity', level: 2, description: 'Bypass slow mode restrictions', category: 'Moderation', difficulty: 2 },
  pin_messages: { name: 'Pin Messages', level: 2, description: 'Pin important messages', category: 'Messages', difficulty: 2 },
  create_polls: { name: 'Create Polls', level: 2, description: 'Create voting polls', category: 'Polls', difficulty: 2 },
  set_slow_mode: { name: 'Set Slow Mode', level: 2, description: 'Configure slow mode delay', category: 'Moderation', difficulty: 2 },
  embed_links: { name: 'Embed Links', level: 2, description: 'Links show as rich previews', category: 'Messages', difficulty: 2 },
  custom_status: { name: 'Custom Status', level: 2, description: 'Set a custom status message', category: 'Profile', difficulty: 2 },
  colored_messages: { name: 'Colored Messages', level: 2, description: 'Send colored text messages', category: 'Messages', difficulty: 2 },
  
  // Level 3 - Moderator (Tier 3 difficulty - 75% approval)
  kick_users: { name: 'Kick Users', level: 3, description: 'Remove users from room', category: 'Moderation', difficulty: 3 },
  mute_users: { name: 'Mute Users', level: 3, description: 'Silence users temporarily', category: 'Moderation', difficulty: 3 },
  warn_users: { name: 'Warn Users', level: 3, description: 'Issue warnings to users', category: 'Moderation', difficulty: 3 },
  timeout_users: { name: 'Timeout Users', level: 3, description: 'Temporary mute users', category: 'Moderation', difficulty: 3 },
  manage_polls: { name: 'Manage Polls', level: 3, description: 'Edit/close any poll', category: 'Polls', difficulty: 3 },
  manage_nicknames: { name: 'Manage Nicknames', level: 3, description: 'Change others nicknames', category: 'Profile', difficulty: 3 },
  view_deleted: { name: 'View Deleted', level: 3, description: 'See deleted messages in logs', category: 'Messages', difficulty: 3 },
  mention_everyone: { name: 'Mention Everyone', level: 3, description: 'Use @everyone to notify all', category: 'Messages', difficulty: 3 },
  view_logs: { name: 'View Message Logs', level: 3, description: 'Access message edit/delete history', category: 'Messages', difficulty: 3 },
  
  // Level 4 - Admin (Tier 4 difficulty - 85% approval)
  delete_others_messages: { name: 'Delete Others Messages', level: 4, description: 'Delete any message', category: 'Messages', difficulty: 4 },
  freeze_chat: { name: 'Freeze Chat', level: 4, description: 'Freeze/unfreeze the chat', category: 'Moderation', difficulty: 4 },
  manage_roles: { name: 'Manage Roles', level: 4, description: 'Assign and remove roles', category: 'Roles', difficulty: 4 },
  ban_users: { name: 'Ban Users', level: 4, description: 'Ban users from room', category: 'Moderation', difficulty: 4 },
  unban_users: { name: 'Unban Users', level: 4, description: 'Remove user bans', category: 'Moderation', difficulty: 4 },
  create_announcements: { name: 'Create Announcements', level: 4, description: 'Send highlighted announcements', category: 'Messages', difficulty: 4 },
  pin_any_message: { name: 'Pin Any Message', level: 4, description: 'Pin messages anywhere', category: 'Messages', difficulty: 4 },
  priority_messages: { name: 'Priority Messages', level: 4, description: 'Messages highlighted at top', category: 'Messages', difficulty: 4 },
  
  // Level 5 - Super Admin (Tier 5 difficulty - 90% approval)
  admin_access: { name: 'Admin Access', level: 5, description: 'Full admin panel access', category: 'Admin', difficulty: 5 },
  create_roles: { name: 'Create Roles', level: 5, description: 'Create new roles', category: 'Roles', difficulty: 5 },
  delete_roles: { name: 'Delete Roles', level: 5, description: 'Delete existing roles', category: 'Roles', difficulty: 5 },
  administrator: { name: 'Administrator', level: 5, description: 'Full administrator access', category: 'Admin', difficulty: 5 },
  manage_all_roles: { name: 'Manage All Roles', level: 5, description: 'Edit any role settings', category: 'Roles', difficulty: 5 },
  bypass_all_limits: { name: 'Bypass All Limits', level: 5, description: 'Ignore all restrictions', category: 'Admin', difficulty: 5 },
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

// Color definitions - 24 options
export const ROLE_COLORS = {
  red: { name: 'Red', hex: '#EF4444' },
  orange: { name: 'Orange', hex: '#F97316' },
  amber: { name: 'Amber', hex: '#F59E0B' },
  yellow: { name: 'Yellow', hex: '#EAB308' },
  lime: { name: 'Lime', hex: '#84CC16' },
  green: { name: 'Green', hex: '#22C55E' },
  emerald: { name: 'Emerald', hex: '#10B981' },
  teal: { name: 'Teal', hex: '#14B8A6' },
  cyan: { name: 'Cyan', hex: '#06B6D4' },
  sky: { name: 'Sky', hex: '#0EA5E9' },
  blue: { name: 'Blue', hex: '#3B82F6' },
  indigo: { name: 'Indigo', hex: '#6366F1' },
  violet: { name: 'Violet', hex: '#8B5CF6' },
  purple: { name: 'Purple', hex: '#A855F7' },
  fuchsia: { name: 'Fuchsia', hex: '#D946EF' },
  pink: { name: 'Pink', hex: '#EC4899' },
  rose: { name: 'Rose', hex: '#F43F5E' },
  slate: { name: 'Slate', hex: '#64748B' },
  gray: { name: 'Gray', hex: '#6B7280' },
  zinc: { name: 'Zinc', hex: '#71717A' },
  neutral: { name: 'Neutral', hex: '#737373' },
  stone: { name: 'Stone', hex: '#78716C' },
  gold: { name: 'Gold', hex: '#FFD700' },
  silver: { name: 'Silver', hex: '#C0C0C0' },
} as const;

export type RoleColorKey = keyof typeof ROLE_COLORS;

export interface Role {
  id: string;
  name: string;
  color: RoleColorKey;
  permissions: PermissionKey[];
  createdAt: number;
  createdBy: string;
}

export interface UserRole {
  roleId: string;
  username: string;
  assignedAt: number;
  assignedBy: string; // 'poll' if assigned via poll
}

export interface RolePoll {
  id: string;
  roleId: string;
  roleName: string;
  roleColor: RoleColorKey;
  rolePermissions: PermissionKey[];
  requester: string;
  createdAt: number;
  expiresAt: number;
  votes: Record<string, boolean>; // username -> approve (true) / deny (false)
  status: 'pending' | 'approved' | 'denied' | 'expired';
  requiredApproval: number; // Percentage needed for approval based on difficulty
}

export interface RoleState {
  roles: Role[];
  userRoles: UserRole[];
  polls: RolePoll[];
}

// Helper to get highest power level from permissions
export function getRolePowerLevel(permissions: PermissionKey[]): number {
  if (permissions.length === 0) return 0;
  return Math.max(...permissions.map(p => PERMISSIONS[p].level));
}

// Helper to get highest difficulty tier from permissions
export function getRoleDifficulty(permissions: PermissionKey[]): PermissionDifficulty {
  if (permissions.length === 0) return 1;
  return Math.max(...permissions.map(p => PERMISSIONS[p].difficulty));
}

// Helper to check if a role has a specific permission
export function hasPermission(role: Role, permission: PermissionKey): boolean {
  return role.permissions.includes(permission);
}

// Helper to get all permissions for a user (combined from all their roles)
export function getUserPermissions(userRoles: Role[], allRoles: Role[]): PermissionKey[] {
  const permissionSet = new Set<PermissionKey>();
  userRoles.forEach(role => {
    role.permissions.forEach(p => permissionSet.add(p));
  });
  return Array.from(permissionSet);
}

// Helper to get the highest role for a user (for display color)
export function getHighestRole(roles: Role[]): Role | null {
  if (roles.length === 0) return null;
  return roles.reduce((highest, role) => {
    const highestLevel = getRolePowerLevel(highest.permissions);
    const roleLevel = getRolePowerLevel(role.permissions);
    return roleLevel > highestLevel ? role : highest;
  });
}

// Default role presets
export const DEFAULT_ROLE_PRESETS: Omit<Role, 'id' | 'createdAt' | 'createdBy'>[] = [
  {
    name: 'Regular',
    color: 'blue',
    permissions: ['slow_mode_immunity', 'pin_messages', 'create_polls', 'embed_links', 'custom_status'],
  },
  {
    name: 'Moderator',
    color: 'green',
    permissions: ['slow_mode_immunity', 'pin_messages', 'create_polls', 'embed_links', 'custom_status', 'kick_users', 'mute_users', 'warn_users', 'timeout_users', 'manage_polls', 'manage_nicknames', 'view_deleted', 'set_slow_mode', 'mention_everyone', 'view_logs'],
  },
  {
    name: 'Admin',
    color: 'purple',
    permissions: ['slow_mode_immunity', 'pin_messages', 'create_polls', 'embed_links', 'custom_status', 'kick_users', 'mute_users', 'warn_users', 'timeout_users', 'manage_polls', 'manage_nicknames', 'view_deleted', 'set_slow_mode', 'mention_everyone', 'view_logs', 'delete_others_messages', 'freeze_chat', 'manage_roles', 'ban_users', 'unban_users', 'create_announcements', 'pin_any_message', 'priority_messages'],
  },
  {
    name: 'Super Admin',
    color: 'gold',
    permissions: Object.keys(PERMISSIONS) as PermissionKey[],
  },
];