import { Message } from '../types/Message';

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

class ConversationService {
  private readonly STORAGE_KEY = 'durabilis_conversations';

  // Récupérer toutes les conversations
  getConversations(): Conversation[] {
    const conversations = localStorage.getItem(this.STORAGE_KEY);
    if (!conversations) return [];
    
    return JSON.parse(conversations).map((conv: any) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  }

  // Récupérer une conversation spécifique
  getConversation(id: string): Conversation | null {
    const conversations = this.getConversations();
    return conversations.find(conv => conv.id === id) || null;
  }

  // Créer une nouvelle conversation
  createConversation(title: string, initialMessage: Message): Conversation {
    const conversations = this.getConversations();
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title,
      messages: [initialMessage],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    conversations.push(newConversation);
    this.saveConversations(conversations);
    return newConversation;
  }

  // Mettre à jour une conversation
  updateConversation(id: string, messages: Message[]): Conversation | null {
    const conversations = this.getConversations();
    const index = conversations.findIndex(conv => conv.id === id);
    
    if (index === -1) return null;

    const updatedConversation = {
      ...conversations[index],
      messages,
      updatedAt: new Date()
    };

    conversations[index] = updatedConversation;
    this.saveConversations(conversations);
    return updatedConversation;
  }

  // Supprimer une conversation
  deleteConversation(id: string): boolean {
    const conversations = this.getConversations();
    const filteredConversations = conversations.filter(conv => conv.id !== id);
    
    if (filteredConversations.length === conversations.length) {
      return false;
    }

    this.saveConversations(filteredConversations);
    return true;
  }

  // Sauvegarder toutes les conversations
  private saveConversations(conversations: Conversation[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(conversations));
  }
}

export const conversationService = new ConversationService(); 