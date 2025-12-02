from schemas.BaseModelSchemas import RequestBaseModel
from schemas.BaseModelSchemas import ErrorBaseModel
from services.DataInputService import process_data_input
def dataInput(data:RequestBaseModel):
    try:
        dataInputService = process_data_input(data)
        return dataInputService
    except Exception as e:
        return ErrorBaseModel(success=False,error=str(e))

        
        
    
