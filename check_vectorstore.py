from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from config import VECTORSTORE_CONFIG

def check_vectorstore(keywords=None):
    # Initialisation des embeddings
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    # Chargement de la base vectorielle
    vectorstore = Chroma(
        persist_directory=VECTORSTORE_CONFIG["path"],
        embedding_function=embeddings
    )
    
    # Récupération de tous les documents
    collection = vectorstore.get()
    
    print("\n=== Informations sur la base vectorielle ===")
    print(f"Nombre de documents : {len(collection['ids'])}")
    
    if len(collection['ids']) > 0:
        print("\n=== Recherche de mots-clés dans les documents ===")
        for keyword in keywords:
            keyword = keyword.strip()
            found = False
            count = 0
            print(f"\n--- Résultats pour le mot-clé : '{keyword}' ---")
            for i, (doc_id, doc, metadata) in enumerate(zip(collection['ids'], collection['documents'], collection['metadatas'])):
                if keyword.lower() in doc.lower():
                    found = True
                    count += 1
                    print(f"\nDocument {i+1}:")
                    print(f"ID: {doc_id}")
                    print(f"Contenu: {doc[:200]}...")  # Affiche les 200 premiers caractères
                    print(f"Métadonnées: {metadata}")
            if found:
                print(f"\nNombre de chunks contenant '{keyword}' : {count}")
            else:
                print(f"Aucun chunk ne contient le mot-clé '{keyword}'.")
    else:
        print("\nLa base vectorielle est vide !")

if __name__ == "__main__":
    # Demande à l'utilisateur des mots-clés à rechercher
    keywords_input = input("Entrez un ou plusieurs mots-clés à rechercher (séparés par des virgules) : ").strip()
    if keywords_input == "":
        keywords = [""]
    else:
        keywords = [k.strip() for k in keywords_input.split(",") if k.strip()]
    check_vectorstore(keywords) 