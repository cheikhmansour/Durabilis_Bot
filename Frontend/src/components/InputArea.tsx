import React, { useState, useRef, useEffect } from 'react';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  onNewChat: () => void;
  disabled: boolean;
  showSuggestions?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({
  onSendMessage,
  onNewChat,
  disabled,
  showSuggestions = true
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  });

  // Suggested questions with emojis
  const suggestedQuestions = [
    "🌱 Quels sont les derniers indicateurs de la transition énergétique ?",
    "📊 Comment mesurer l'impact environnemental d'une entreprise ?",
    "♻️ Quelles sont les meilleures pratiques en économie circulaire ?",
    "⚽ Comment intégrer la durabilité dans le sport professionnel ?",
    "🏢 Critères ESG pour l'évaluation des entreprises",
    "🌍 Impact du changement climatique sur l'économie"
  ];

  const handleSuggestedQuestion = (question: string) => {
    if (!disabled) {
      // Remove emoji from the question before sending
      const cleanQuestion = question.replace(/^[^\w\s]+\s/, '');
      onSendMessage(cleanQuestion);
    }
  };

  const handleNewChat = () => {
    setMessage('');
    setIsTyping(false);
    onNewChat();
  };

  // Show suggestions only when input is empty and suggestions are enabled
  const shouldShowSuggestions = showSuggestions && !isTyping && message.length === 0;

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky bottom-0 z-20">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">

        {/* Horizontal Scrollable Suggestions */}
        {shouldShowSuggestions && (
          <div className="mb-3 sm:mb-4 animate-slide-up">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 sm:mb-3 flex items-center">
              <span className="mr-2">💡</span>
              Questions suggérées
            </p>
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={question.slice(0, 20)}
                  onClick={() => handleSuggestedQuestion(question)}
                  disabled={disabled}
                  className="flex-shrink-0 group relative overflow-hidden bg-gradient-to-r from-durabilis-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 hover:from-durabilis-100 hover:to-blue-100 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-full border border-durabilis-200 dark:border-gray-600 hover:border-durabilis-300 dark:hover:border-gray-500 transition-all duration-300 hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards'
                  }}
                >
                  <span className="font-medium whitespace-nowrap">{question}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-durabilis-primary to-durabilis-light opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2 sm:gap-3">

            {/* New Chat Button */}
            <button
              type="button"
              onClick={handleNewChat}
              disabled={disabled}
              className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
              title="Nouvelle conversation"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Message Input Container */}
            <div className="flex-1 relative">
              <div className="relative rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-durabilis-300 dark:hover:border-durabilis-500 transition-colors duration-200 focus-within:border-durabilis-primary dark:focus-within:border-durabilis-light focus-within:ring-2 focus-within:ring-durabilis-100 dark:focus-within:ring-durabilis-900">

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Posez votre question sur le développement durable..."
                  disabled={disabled}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 sm:pr-16 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none border-0 outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-sm sm:text-base"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />

                {/* Character Counter */}
                {message.length > 0 && (
                  <div className="absolute bottom-1.5 sm:bottom-2 right-12 sm:right-16 text-xs text-gray-400 bg-white dark:bg-gray-700 px-1 rounded">
                    {message.length}/2000
                  </div>
                )}

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!message.trim() || disabled}
                  className="absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 w-8 h-8 sm:w-10 sm:h-10 bg-durabilis-primary hover:bg-durabilis-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group hover:scale-105"
                >
                  {disabled ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Helper Text */}
          <div className="mt-2 sm:mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline">Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne</span>
              <span className="sm:hidden">Entrée pour envoyer</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="hidden sm:inline">Propulsé par</span>
              <span className="font-semibold text-durabilis-primary dark:text-durabilis-light">DURABILIS.CO</span>
              <span className="text-green-500">●</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputArea;
