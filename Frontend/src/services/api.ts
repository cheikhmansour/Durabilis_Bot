import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

interface Source {
    fichier: string;
    titre: string;
    date_modification: string;
}

interface ChatResponse {
    reponse: string;
    sources: Source[];
}

interface ChatRequest {
    message: string;
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const chatService = {
    sendMessage: async (message: string): Promise<ChatResponse> => {
        try {
            const response = await api.post<ChatResponse>('/chat', { message });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            throw error;
        }
    },

    checkHealth: async (): Promise<{ status: string }> => {
        try {
            const response = await api.get<{ status: string }>('/health');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la vérification de la santé de l\'API:', error);
            throw error;
        }
    }
}; 