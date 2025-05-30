import os
import json
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

# Définir directement ta clé API
os.environ["GOOGLE_API_KEY"] = "AIzaSyDOFi3F068et2KSyo5aqoOSKUpN2Q65toA"

# Charger le fichier JSON
with open("Livrable_01.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Créer une liste de documents
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

# Découper en chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=150)
chunks = text_splitter.split_documents(documents)

# Générer les embeddings avec Gemini
embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001", task_type="retrieval_document")

# Créer l'index FAISS
db = FAISS.from_documents(chunks, embedding)

# Sauvegarder l'index
db.save_local("vectorstore_livrable01")
