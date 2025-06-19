import React, { useState } from 'react';
import { Conversation } from '../services/conversationService';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  conversations: Conversation[];
  currentConversationId: string | null;
  onConversationSelect: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  onNewChat, 
  onDeleteConversation,
  conversations,
  currentConversationId,
  onConversationSelect
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    setDeleteConfirm(conversationId);
  };

  const confirmDelete = (conversationId: string) => {
    onDeleteConversation(conversationId);
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleShareConversation = (e: React.MouseEvent, conversation: Conversation) => {
    e.stopPropagation();

    if (navigator.share) {
      navigator.share({
        title: `Conversation DURABILIS.CO - ${conversation.title}`,
        text: `Découvrez cette conversation sur ${conversation.title}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copy link to clipboard
      const shareText = `Conversation DURABILIS.CO - ${conversation.title}\n${window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        console.log('Lien de conversation copié dans le presse-papiers');
      }).catch(console.error);
    }
  };

  const handleExportConversation = (e: React.MouseEvent, conversation: Conversation) => {
    e.stopPropagation();

    const exportContent = `
DURABILIS.CO - Export de Conversation
=====================================

Titre: ${conversation.title}
Date: ${conversation.updatedAt.toLocaleString('fr-FR')}

Messages:
${conversation.messages.map(msg => `
${msg.type === 'user' ? '👤 Vous' : '🤖 Assistant'}: ${msg.content}
`).join('\n')}

---

Cette conversation a été exportée depuis l'assistant IA DURABILIS.CO
spécialisé dans l'analyse de documents techniques sur le développement durable.

Pour plus d'informations: https://durabilis.co
Export généré le: ${new Date().toLocaleString('fr-FR')}
    `.trim();

    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `durabilis-${conversation.title.toLowerCase().replace(/\s+/g, '-')}-${conversation.updatedAt.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleNewChat = () => {
    onNewChat();
    onClose();
  };

  return (
    <>
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">💬</span>
            Conversations
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Fermer le menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Conversation Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full bg-durabilis-primary hover:bg-durabilis-600 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center group hover:shadow-md"
          >
            <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle conversation
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-2">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="mb-2 relative group">
                {/* Conversation Item */}
                <button
                  onClick={() => onConversationSelect(conversation.id)}
                  className={`w-full text-left p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border ${
                    currentConversationId === conversation.id
                      ? 'border-durabilis-primary dark:border-durabilis-light bg-durabilis-50 dark:bg-durabilis-900'
                      : 'border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                        {conversation.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {conversation.messages[conversation.messages.length - 1]?.content || 'Nouvelle conversation'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {conversation.updatedAt.toLocaleString('fr-FR')}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteConversation(e, conversation.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 shrink-0"
                      title="Supprimer la conversation"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </button>

                {/* Additional Action Buttons */}
                <div className="hidden group-hover:flex items-center justify-end gap-1 px-3 pb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Share Button */}
                  <button
                    onClick={(e) => handleShareConversation(e, conversation)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-durabilis-primary hover:bg-durabilis-50 dark:hover:bg-durabilis-900 transition-colors"
                    title="Partager la conversation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>

                  {/* Export Button */}
                  <button
                    onClick={(e) => handleExportConversation(e, conversation)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                    title="Exporter la conversation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirm === conversation.id && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-xl p-3 shadow-lg z-10">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Supprimer cette conversation ?</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Cette action est irréversible</p>
                      <div className="flex gap-2">
                        <button
                          onClick={cancelDelete}
                          className="flex-1 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => confirmDelete(conversation.id)}
                          className="flex-1 px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p className="flex items-center justify-center gap-1">
              <span>🌱</span>
              Données au service du développement durable
            </p>
            <p className="mt-1 font-medium">© 2025 DURABILIS & CO</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
