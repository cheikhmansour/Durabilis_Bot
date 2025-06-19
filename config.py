import os
from dotenv import load_dotenv

# Chargement des variables d'environnement
load_dotenv()

# Configuration des API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyBXFTSet6N_mEqht8KYwEcJhu-v1PVuonw")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Configuration du modèle
MODEL_CONFIG = {
    "model_name": "gemini-2.0-flash",
    "temperature": 0.3,
    "max_output_tokens": 2048,
    "top_p": 0.8,
    "top_k": 40
}

# Configuration du vectorstore
VECTORSTORE_CONFIG = {
    "path": "vectorstore_livrable01",
    "k_nearest_neighbors": 5,
    "score_threshold": 0.6
}

# Configuration du prompt système
SYSTEM_PROMPT = """Tu es un assistant IA spécialisé dans l'analyse de documents. Tu dois :
1. Répondre de manière précise et concise aux questions posées
2. Utiliser uniquement les informations fournies dans le contexte
3. Si tu ne trouves pas l'information dans le contexte, dire clairement que tu ne peux pas répondre
4. Structurer tes réponses de manière claire et professionnelle
5. Citer les sources pertinentes dans ta réponse
6. Maintenir un ton professionnel et objectif

Contexte : {context}

Question : {question}

Réponse :""" 