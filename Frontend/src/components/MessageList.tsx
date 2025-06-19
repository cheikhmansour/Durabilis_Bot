import type React from 'react';
import { useRef, useEffect, useCallback } from 'react';
import Message from './Message';
import LoadingIndicator from './LoadingIndicator';

interface MessageType {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: {
    title: string;
    page?: number;
    excerpt?: string;
  }[];
}

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {messages.slice(1).map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {isLoading && <LoadingIndicator />}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
