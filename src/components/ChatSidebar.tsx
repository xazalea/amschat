import { Users, LogOut, Shield, ChevronDown, ChevronRight, History } from 'lucide-react';
import { useState } from 'react';
import { RoomUser, ChatMessage } from '@/types/chat';
import { Role, ROLE_COLORS, PermissionKey } from '@/types/role';
import { UserRoleBadges, RoleBadge } from '@/components/RoleBadge';
import { MessageLogs } from '@/components/MessageLogs';

interface ChatSidebarProps {
  roomCode: string;
  users: RoomUser[];
  roles: Role[];
  messages: ChatMessage[];
  getUserRoles: (username: string) => Role[];
  hasPermission: (permission: PermissionKey) => boolean;
  onLeave: () => void;
}

export function ChatSidebar({ roomCode, users, roles, messages, getUserRoles, hasPermission, onLeave }: ChatSidebarProps) {
  const [showRoles, setShowRoles] = useState(true);
  const [showUsers, setShowUsers] = useState(true);
  const [showLogs, setShowLogs] = useState(false);
  
  const canViewLogs = hasPermission('view_logs');
  const canViewDeleted = hasPermission('view_deleted');

  return (
    <div className="w-56 h-full bg-card flex flex-col shrink-0 hidden md:flex">
      <div className="p-4">
        <span className="text-xs font-medium text-muted-foreground">Room</span>
        <p className="text-sm font-medium text-foreground truncate mt-0.5">{roomCode}</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Roles Section */}
        {roles.length > 0 && (
          <div className="px-4 pb-2">
            <button
              onClick={() => setShowRoles(!showRoles)}
              className="flex items-center gap-1.5 w-full"
            >
              {showRoles ? (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              <Shield className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Roles — {roles.length}</span>
            </button>
            {showRoles && (
              <div className="mt-2 space-y-1 pl-5">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center gap-2">
                    <RoleBadge role={role} size="xs" />
                    <span className="text-[10px] text-muted-foreground">
                      {users.filter(u => getUserRoles(u.username).some(r => r.id === role.id)).length}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Section */}
        <div className="px-4 py-2">
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="flex items-center gap-1.5 w-full"
          >
            {showUsers ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Online — {users.length}</span>
          </button>
          {showUsers && (
            <div className="mt-2 space-y-1.5 pl-5">
              {users.map((u) => {
                const userRoles = getUserRoles(u.username);
                return (
                  <div key={u.username} className="px-2 py-1 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-online shrink-0" />
                      <span className="text-sm text-foreground truncate">{u.username}</span>
                    </div>
                    {userRoles.length > 0 && (
                      <div className="ml-3.5 mt-0.5">
                        <UserRoleBadges roles={userRoles} size="xs" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2">
        {/* Message Logs Button */}
        {canViewLogs && (
          <button
            onClick={() => setShowLogs(true)}
            className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 rounded-md hover:bg-muted"
          >
            <History className="w-4 h-4" />
            Message Logs
          </button>
        )}
        
        <button
          onClick={onLeave}
          className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 rounded-md hover:bg-muted"
        >
          <LogOut className="w-4 h-4" />
          Leave
        </button>
      </div>

      {/* Message Logs Dialog */}
      <MessageLogs
        open={showLogs}
        onClose={() => setShowLogs(false)}
        messages={messages}
        canViewDeleted={canViewDeleted}
      />
    </div>
  );
}
