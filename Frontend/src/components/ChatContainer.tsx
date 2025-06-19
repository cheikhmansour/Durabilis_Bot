import type React from 'react';
import { useState, useEffect } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { chatService } from '../services/api';
import { Conversation } from '../services/conversationService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: {
    title: string;
    fichier: string;
    date_modification: string;
  }[];
}

interface ChatContainerProps {
  onNewChat: () => void;
  currentConversation: Conversation | null;
  onConversationUpdate: (messages: Message[]) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  onNewChat, 
  currentConversation,
  onConversationUpdate 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mettre à jour les messages quand la conversation change
  useEffect(() => {
    if (currentConversation) {
      setMessages(currentConversation.messages);
    } else {
      setMessages([{
        id: '1',
        type: 'assistant',
        content: "Bonjour ! Je suis l'assistant IA de DURABILIS.CO, spécialisé dans l'analyse de documents techniques sur le développement durable, l'environnement et le sport. Comment puis-je vous aider aujourd'hui ?",
        timestamp: new Date(),
      }]);
    }
  }, [currentConversation]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    onConversationUpdate(newMessages);
    setIsLoading(true);

    try {
      // Appel à notre API
      const response = await chatService.sendMessage(content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.reponse,
        timestamp: new Date(),
        sources: response.sources.map(source => ({
          title: source.titre,
          fichier: source.fichier,
          date_modification: source.date_modification
        }))
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      onConversationUpdate(updatedMessages);
    } catch (error) {
      // Message d'erreur en cas d'échec
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Désolé, une erreur est survenue lors du traitement de votre question. Veuillez réessayer.",
        timestamp: new Date(),
      };
      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
      onConversationUpdate(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([{
      id: '1',
      type: 'assistant',
      content: "Bonjour ! Je suis l'assistant IA de DURABILIS.CO, spécialisé dans l'analyse de documents techniques sur le développement durable, l'environnement et le sport. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    }]);
    setIsLoading(false);
    onNewChat();
  };

  // Show suggestions when there's only the welcome message
  const showSuggestions = messages.length === 1;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Welcome Message for empty state */}
      {messages.length === 1 && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-2xl text-center">
            <div className="w-16 h-16 durabilis-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Bienvenue sur DURABILIS.CO
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Posez vos questions sur le développement durable, l'environnement et le sport.
              J'analyserai nos documents techniques pour vous fournir des réponses précises et sourcées.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-durabilis-primary dark:text-durabilis-light mb-2">
                  🌱 Transition énergétique
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Analyses et recommandations sur les énergies renouvelables
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-durabilis-primary dark:text-durabilis-light mb-2">
                  📊 Données RSE
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Indicateurs de performance environnementale et sociale
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message List */}
      {messages.length > 1 && (
        <MessageList messages={messages} isLoading={isLoading} />
      )}

      {/* Input Area */}
      <InputArea
        onSendMessage={handleSendMessage}
        onNewChat={handleNewChat}
        disabled={isLoading}
        showSuggestions={showSuggestions}
      />
    </div>
  );
};

export default ChatContainer;
