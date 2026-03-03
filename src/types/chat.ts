export interface MessageReaction {
  emoji: string;
  users: string[]; // usernames who reacted
}

// Message edit history entry
export interface MessageEdit {
  previousText: string;
  editedAt: number;
  editedBy: string;
}

export interface ChatMessage {
  id: string;
  username: string;
  text: string;
  timestamp: number;
  type: 'message' | 'system' | 'announcement' | 'poll' | 'gif' | 'sticker';
  status?: 'sent' | 'delivered' | 'read';
  edited?: boolean;
  deleted?: boolean;
  deletedAt?: number;
  deletedBy?: string;
  imageUrl?: string;
  imageExpiry?: number;
  pollId?: string;
  reactions?: MessageReaction[];
  pinned?: boolean;
  pinnedBy?: string;
  pinnedAt?: number;
  replyTo?: {
    messageId: string;
    username: string;
    text: string;
  };
  // Edit history - array of previous versions
  editHistory?: MessageEdit[];
  // Original text (before any edits)
  originalText?: string;
}

// Message log entry for tracking all changes
export interface MessageLogEntry {
  id: string;
  messageId: string;
  action: 'created' | 'edited' | 'deleted' | 'restored';
  username: string;
  previousText?: string;
  newText?: string;
  timestamp: number;
}

export interface RoomUser {
  username: string;
  joinedAt: number;
  muted?: boolean;
  mutedBy?: string;
  mutedUntil?: number;
  warnedCount?: number;
  warnedBy?: string[];
  timeoutUntil?: number;
  timeoutBy?: string;
}

export interface PinnedMessage {
  messageId: string;
  pinnedBy: string;
  pinnedAt: number;
}

export interface Bookmark {
  id: string;
  messageId: string;
  username: string;
  createdAt: number;
}

export interface SlowMode {
  enabled: boolean;
  delay: number; // in seconds
  setBy: string;
}

export interface ChatState {
  username: string;
  roomCode: string;
  messages: ChatMessage[];
  users: RoomUser[];
  isJoined: boolean;
  notificationsEnabled: boolean;
  typingUsers: string[];
  frozen: boolean;
  frozenBy: string | null;
  slowMode: SlowMode | null;
  pinnedMessages: PinnedMessage[];
  bookmarks: Bookmark[];
}