from schemas.BaseModelSchemas import RequestBaseModel
from services.LangchainService.LanchChainService import Langchain_Service
from MachineLearning.ReccomendationSystemModel import ReccomendationSystem
from schemas.BaseModelSchemas import ErrorBaseModel
import json


def process_data_input(data:RequestBaseModel):
    try:
        langchain_service = Langchain_Service()
        nutrient_output = langchain_service.step_one(data)
        reccomendation_model = ReccomendationSystem()
        model_output = reccomendation_model.recommend_ensemble(nutrient_output,15)
        final_output = langchain_service.step_two(user_prompt=data.data,scored_food_list=model_output.to_dict(orient="records"))
        return final_output
    except Exception as e:
        return ErrorBaseModel(success=False,error=str(e))