export interface Source {
  title: string;
  page: number;
  confidence: number;
}

export interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Source[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface ConversationHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}
