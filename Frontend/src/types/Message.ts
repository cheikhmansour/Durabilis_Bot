export interface Source {
  title: string;
  page?: number;
  url?: string;
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Source[];
}
