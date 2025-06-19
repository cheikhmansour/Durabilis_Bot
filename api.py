from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from chatbot import qa_chain, format_response

app = FastAPI(title="Chatbot RAG API")

# Configuration CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifiez les origines autorisées
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Source(BaseModel):
    fichier: str
    titre: str
    date_modification: str

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reponse: str
    sources: List[Source] = []

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Obtenir la réponse du chatbot en utilisant invoke()
        response = qa_chain.invoke({"question": request.message})
        
        # Obtenir la réponse et les sources
        answer = response['answer'] if 'answer' in response else response['text']
        sources = []
        
        # Si des sources sont disponibles, les formater
        if 'source_documents' in response:
            sources = [
                Source(
                    fichier=doc.metadata.get('source', ''),
                    titre=doc.metadata.get('title', ''),
                    date_modification=doc.metadata.get('date', '')
                )
                for doc in response['source_documents']
            ]
        
        # Retourner la réponse avec les sources
        return ChatResponse(
            reponse=answer,
            sources=sources
        )
    except Exception as e:
        print(f"Erreur lors du traitement de la requête: {str(e)}")  # Ajout de logging
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True) 