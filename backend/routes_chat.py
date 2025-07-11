from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_endpoint(chat: ChatRequest):
    return {"response": f"You said: {chat.message}. (AI response coming soon!)"} 