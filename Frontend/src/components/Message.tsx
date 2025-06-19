import type React from 'react';
import { useState } from 'react';

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

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [copied, setCopied] = useState(false);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Réponse DURABILIS.CO',
          text: message.content,
        });
      } catch (err) {
        console.error('Error sharing: ', err);
      }
    } else {
      handleCopy();
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(feedback === type ? null : type);
    console.log('Feedback:', type, 'for message:', message.id);
  };

  return (
    <div className={`flex mb-6 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>

        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8">
          {isUser ? (
            <div className="w-8 h-8 bg-gradient-to-br from-durabilis-primary to-durabilis-light rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
          ) : (
            <div className="w-8 h-8 durabilis-gradient rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 10.93C16.16 26.739 20 22.55 20 17V7l-8-5z"/>
                <path d="M8 11v6h8v-6H8zm2 4v-2h4v2h-4z" fill="white" fillOpacity="0.8"/>
              </svg>
            </div>
          )}
        </div>

        {/* Message Bubble Container */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>

          {/* Message Bubble */}
          <div className={`
            relative px-4 py-3 rounded-2xl shadow-sm max-w-full
            ${isUser
              ? 'bg-durabilis-primary text-white rounded-br-md'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md'
            }
          `}>
            {/* Message Content */}
            <div className="prose prose-sm max-w-none">
              <p className="mb-0 whitespace-pre-wrap leading-relaxed">{message.content}</p>
            </div>

            {/* Message Tail */}
            <div className={`
              absolute bottom-0 w-3 h-3
              ${isUser
                ? 'right-0 translate-x-1 bg-durabilis-primary'
                : 'left-0 -translate-x-1 bg-white dark:bg-gray-800 border-l border-b border-gray-200 dark:border-gray-700'
              }
              ${isUser ? 'rounded-bl-full' : 'rounded-br-full'}
            `} />
          </div>

          {/* Sources */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-3 space-y-2 w-full">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                📚 Sources
              </p>
              <div className="space-y-2">
                {message.sources.map((source, index) => (
                  <div
                    key={`${source.title}-${source.page || index}`}
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-durabilis-primary dark:text-durabilis-light">
                          {source.title}
                        </h4>
                        {source.page && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            📄 Page {source.page}
                          </p>
                        )}
                        {source.excerpt && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 italic">
                            "{source.excerpt}"
                          </p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp and Actions Row */}
          <div className={`flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

            {/* Timestamp */}
            <span className="opacity-70">{formatTime(message.timestamp)}</span>

            {/* Action Buttons for AI messages */}
            {!isUser && (
              <div className="flex items-center gap-1">

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  title={copied ? "Copié !" : "Copier"}
                >
                  {copied ? (
                    <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  title="Partager"
                >
                  <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>

                {/* Feedback Buttons with modern icons */}
                <div className="flex items-center gap-0.5 ml-1">
                  <button
                    onClick={() => handleFeedback('up')}
                    className={`p-1.5 rounded-full transition-all duration-200 ${
                      feedback === 'up'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400 scale-110'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 opacity-60 hover:opacity-100'
                    }`}
                    title="Réponse utile"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleFeedback('down')}
                    className={`p-1.5 rounded-full transition-all duration-200 ${
                      feedback === 'down'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 scale-110'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 opacity-60 hover:opacity-100'
                    }`}
                    title="Réponse pas utile"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
