import json
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Charger le fichier JSON (structure: fichier -> dict avec paragraphes)
with open("Livrable_01.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Étape 1 : Transformer les paragraphes en documents LangChain
documents = []
for nom_fichier, contenu in data.items():
    paragraphs = contenu.get("paragraphes", [])
    texte_complet = "\n".join(paragraphs)
    
    doc = Document(
        page_content=texte_complet,
        metadata={
            "source": nom_fichier,
            "titre": contenu.get("titre", ""),
            "modifié": contenu.get("modifié", ""),
            "indice_rag": contenu.get("indice_rag", "")
        }
    )
    documents.append(doc)

print(f"Nombre de documents créés : {len(documents)}")

# Étape 2 : Splitter les documents en chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=600,
    chunk_overlap=150
)

chunks = text_splitter.split_documents(documents)
print(f"Nombre total de chunks générés : {len(chunks)}")

# Optionnel : afficher un chunk exemple
print("\nExtrait de chunk :\n")
print(chunks[0].page_content)
