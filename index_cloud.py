import os
import json
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_community.vectorstores import Pinecone
from pinecone import Pinecone as PineconeClient
from pinecone import ServerlessSpec

# Configuration
os.environ["GOOGLE_API_KEY"] = "AIzaSyBcVb2XXcurYsJ_TJmdPhGiZa11tJHbx6U"
os.environ["PINECONE_API_KEY"] = "pcsk_4yqCCx_3b4CHM863vZL7DtAjBAthFAHkys6CFrvo3HhRkhWcgxtufNJWdjARqwvkxwcW3o"
PINECONE_API_KEY = os.environ["PINECONE_API_KEY"]
INDEX_NAME = "chatbot768"

# Chargement JSON
with open("Livrable_01.json", "r", encoding="utf-8") as f:
    data = json.load(f)

documents = []
for nom_fichier, contenu in data.items():
    texte = "\n".join(contenu.get("paragraphes", []))
    doc = Document(
        page_content=texte,
        metadata={
            "source": nom_fichier,
            "titre": contenu.get("titre", ""),
            "modifié": contenu.get("modifié", ""),
            "indice_rag": contenu.get("indice_rag", "")
        }
    )
    documents.append(doc)

# Chunking
text_splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=150)
chunks = text_splitter.split_documents(documents)

# Afficher 3 chunks pour vérification
print("\n📌 Aperçu des premiers chunks :\n")
for i, chunk in enumerate(chunks[:3]):
    print(f"--- Chunk {i+1} ---")
    print(chunk.page_content[:1000], "...")
    print("🔎 Métadonnées :", chunk.metadata)
    print()

# Embedding
embedding = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    task_type="retrieval_document"
)

# Connexion Pinecone
pc = PineconeClient(api_key=PINECONE_API_KEY)

# Créer l'index si inexistant
if INDEX_NAME not in pc.list_indexes().names():
    pc.create_index(
        name=INDEX_NAME,
        dimension=768,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
    print(f"✅ Index '{INDEX_NAME}' créé.")

# Ne pas réindexer si vecteurs déjà présents
index = pc.Index(INDEX_NAME)
stats = index.describe_index_stats()
if stats.total_vector_count > 0:
    print(f"ℹ️ L'index '{INDEX_NAME}' contient déjà {stats.total_vector_count} vecteurs. Indexation sautée.")
else:
    try:
        vectorstore = Pinecone.from_documents(
            documents=chunks,
            embedding=embedding,
            index_name=INDEX_NAME
        )
        print(f"✅ Indexation terminée avec {len(chunks)} chunks.")
    except Exception as e:
        print("❌ Échec de l’indexation :", str(e))
