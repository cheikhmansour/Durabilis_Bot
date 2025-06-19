import os
import logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)
from langchain_community.vectorstores import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from config import (
    GOOGLE_API_KEY,
    MODEL_CONFIG,
    VECTORSTORE_CONFIG,
    SYSTEM_PROMPT
)

# Configuration de la clé API Google
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Initialisation du modèle
logger.info("Initializing model...")
model = ChatGoogleGenerativeAI(
    model=MODEL_CONFIG["model_name"],
    google_api_key=GOOGLE_API_KEY,
    temperature=MODEL_CONFIG["temperature"],
    max_output_tokens=MODEL_CONFIG["max_output_tokens"],
    top_p=MODEL_CONFIG["top_p"],
    convert_system_message_to_human=True
)
logger.info("Model initialized successfully!")

# Initialisation du vector store
logger.info("Initializing vector store...")

from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Initialisation des embeddings
embedding = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    task_type="retrieval_document"
)

# Configuration du vector store
logger.info("Initializing vector store...")
vectorstore = Chroma(
    persist_directory="vectorstore_livrable01",
    embedding_function=embedding,
    collection_name="chatbot"
)
logger.info("Application initialized successfully!")

# Configuration de la mémoire
memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

# Configuration du prompt
prompt = PromptTemplate(
    template=SYSTEM_PROMPT,
    input_variables=["context", "question", "chat_history"]
)

# Création de la chaîne de conversation
qa_chain = ConversationalRetrievalChain.from_llm(
    llm=model,
    retriever=vectorstore.as_retriever(
        search_kwargs={"k": VECTORSTORE_CONFIG["k_nearest_neighbors"]}
    ),
    memory=memory,
    combine_docs_chain_kwargs={"prompt": prompt}
)

def format_response(response):
    """Formate la réponse pour l'affichage."""
    print(f"Structure de la réponse reçue: {type(response)}")
    print(f"Contenu de la réponse: {response}")
    
    if isinstance(response, dict):
        if "answer" in response:
            return response["answer"]
        elif "text" in response:
            return response["text"]
        else:
            print(f"Clés disponibles dans la réponse: {response.keys()}")
            return str(response)
    return str(response)

def chat_with_bot():
    """
    Fonction principale pour interagir avec le chatbot.
    Gère la conversation et affiche les réponses avec les sources.
    """
    print("🤖 Bienvenue ! Je suis votre assistant RAG spécialisé dans l'analyse de documents.")
    print("💡 Vous pouvez me poser des questions sur les documents indexés.")
    print("💡 Pour quitter, tapez 'quit'")
    
    while True:
        try:
            # Récupération de la question de l'utilisateur
            question = input("\n👤 Votre question : ")
            
            if question.lower() == 'quit':
                print("👋 Au revoir !")
                break
            
            # Génération de la réponse
            response = qa_chain({"question": question})
            
            # Formatage et affichage de la réponse
            formatted_response = format_response(response)
            
            print("\n🤖 Réponse :")
            print(formatted_response)
            
        except KeyboardInterrupt:
            print("\n👋 Au revoir !")
            break
        except Exception as e:
            print(f"❌ Une erreur est survenue : {str(e)}")
            print("💡 Essayez de reformuler votre question ou de vérifier votre connexion internet.")
            continue

if __name__ == "__main__":
    chat_with_bot() 