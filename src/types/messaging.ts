export type MessageAuthor = 'me' | 'other' | 'agent' | 'system';

export type ToolCall = {
  id: string;
  toolName: string;
  args: Record<string, unknown>;
  status: 'pending' | 'success' | 'error';
  result?: unknown;
  durationMs?: number;
};

export type Message = {
  id: string;
  threadId: string;
  author: MessageAuthor;
  body: string;
  createdAt: string;
  toolCalls?: ToolCall[];
  citations?: Array<{ label: string; url: string }>;
  approvedBySeller?: boolean;
};

export type Thread = {
  id: string;
  listingId?: string;
  participantId: string;
  participantName: string;
  participantAvatarColor: string;
  isAgent: boolean;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

export type Notification = {
  id: string;
  channel: 'in-app' | 'email' | 'push';
  category: 'alert' | 'message' | 'system' | 'agent';
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
};

export type Alert = {
  id: string;
  name: string;
  filters: Record<string, string>;
  channels: Array<'in-app' | 'email' | 'push'>;
  matchCount: number;
  createdAt: string;
  enabled: boolean;
};
