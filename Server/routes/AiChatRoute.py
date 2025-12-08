from fastapi import APIRouter
from schemas.BaseModelSchemas import RequestBaseModel
from services.LangchainService.LanchChainService import Langchain_Service

AiChatRoute = APIRouter(prefix='/api/v1')

@AiChatRoute.post('/chat')
def ai_chat_route(data:RequestBaseModel):
    langchain_service = Langchain_Service()
    res =langchain_service.invoke_agent(data.data)
    return res