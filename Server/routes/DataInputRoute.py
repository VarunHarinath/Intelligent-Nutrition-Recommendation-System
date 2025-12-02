from fastapi import APIRouter
from controllers.DataInputController import dataInput
from schemas.BaseModelSchemas import RequestBaseModel

DataInputRoute = APIRouter(prefix="/api/v1")

@DataInputRoute.post('/data')
async def DataInputRouter(data:RequestBaseModel):
    return dataInput(data)