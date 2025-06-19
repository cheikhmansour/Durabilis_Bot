import type React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start animate-fade-in mb-6">
      <div className="flex max-w-[85%] flex-row items-end gap-3">

        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8">
          <div className="w-8 h-8 durabilis-gradient rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 10.93C16.16 26.739 20 22.55 20 17V7l-8-5z"/>
              <path d="M8 11v6h8v-6H8zm2 4v-2h4v2h-4z" fill="white" fillOpacity="0.8"/>
            </svg>
          </div>
        </div>

        {/* Typing Bubble */}
        <div className="flex flex-col items-start">
          <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">

            {/* Typing Animation */}
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">
                DURABILIS.CO analyse
              </span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-durabilis-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                <div className="w-2 h-2 bg-durabilis-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                <div className="w-2 h-2 bg-durabilis-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
              </div>
            </div>

            {/* Message Tail */}
            <div className="absolute bottom-0 left-0 -translate-x-1 w-3 h-3 bg-white dark:bg-gray-800 border-l border-b border-gray-200 dark:border-gray-700 rounded-br-full" />
          </div>

          {/* Progress Steps */}
          <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2 animate-pulse">
              <div className="w-1.5 h-1.5 bg-durabilis-primary rounded-full animate-ping" />
              <span>Recherche dans les documents...</span>
            </div>
            <div className="flex items-center gap-2 animate-pulse" style={{animationDelay: '1s'}}>
              <div className="w-1.5 h-1.5 bg-durabilis-light rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
              <span>Analyse des sources pertinentes...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
