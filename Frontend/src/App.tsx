import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import Sidebar from './components/Sidebar';
import { ThemeProvider } from './context/ThemeContext';
import { conversationService, Conversation } from './services/conversationService';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Charger les conversations au démarrage
  useEffect(() => {
    const loadedConversations = conversationService.getConversations();
    setConversations(loadedConversations);
  }, []);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNewChat = () => {
    const initialMessage = {
      id: '1',
      type: 'assistant',
      content: "Bonjour ! Je suis l'assistant IA de DURABILIS.CO, spécialisé dans l'analyse de documents techniques sur le développement durable, l'environnement et le sport. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    };

    const newConversation = conversationService.createConversation(
      `Nouvelle conversation ${new Date().toLocaleString('fr-FR')}`,
      initialMessage
    );

    setConversations(prev => [...prev, newConversation]);
    setCurrentConversationId(newConversation.id);

    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteConversation = (conversationId: string) => {
    if (conversationService.deleteConversation(conversationId)) {
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
    }
  };

  const handleExport = () => {
    console.log('Export conversation');
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleConversationSelect = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const currentConversation = currentConversationId 
    ? conversations.find(conv => conv.id === currentConversationId)
    : null;

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
          onNewChat={handleNewChat}
          onDeleteConversation={handleDeleteConversation}
          conversations={conversations}
          currentConversationId={currentConversationId}
          onConversationSelect={handleConversationSelect}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header
            onMenuClick={handleMenuClick}
            onExport={handleExport}
            sidebarOpen={sidebarOpen}
          />
          <ChatContainer 
            onNewChat={handleNewChat}
            currentConversation={currentConversation}
            onConversationUpdate={(messages) => {
              if (currentConversationId) {
                const updated = conversationService.updateConversation(currentConversationId, messages);
                if (updated) {
                  setConversations(prev => 
                    prev.map(conv => conv.id === currentConversationId ? updated : conv)
                  );
                }
              }
            }}
          />
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={handleSidebarClose}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
