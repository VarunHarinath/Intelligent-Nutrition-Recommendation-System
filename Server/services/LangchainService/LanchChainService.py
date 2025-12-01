from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from schemas.BaseModelSchemas import ErrorBaseModel,RequestBaseModel
from .tools.LangchainAgentTools import AdditionTool
from langchain_core.prompts import ChatPromptTemplate
from .prompts.BasePrompts import STEP_1_PROMPT,STEP_2_PROMPT
import os
import re
import json
load_dotenv()
class Langchain_Service:
    def __init__(self):
        self.tools = [AdditionTool]
        self.llm = GoogleGenerativeAI(model = os.getenv('GOOGLE_AI_MODEL'))        
    @staticmethod    
    def parse_llm_json(raw_text: str):
        if not raw_text:
            return {}
        cleaned = re.sub(r"```(?:json)?", "", raw_text, flags=re.IGNORECASE).strip()
        if cleaned.startswith('"') and cleaned.endswith('"'):
            cleaned = cleaned[1:-1]
            cleaned = cleaned.encode("utf-8").decode("unicode_escape")
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            return {"raw_output": cleaned}
    def prompt_invoke(self,query,prompt):
        prompt = ChatPromptTemplate.from_messages([
            ("system",prompt),
            ("human","{user_message}")
        ])
        chain = prompt | self.llm
        output = chain.invoke({"user_message":query})
        return self.parse_llm_json(output)
    def invoke_agent(self,query:RequestBaseModel,mode):
        try:
            if mode == 'step_1':
                return self.prompt_invoke(query=query.data,prompt=STEP_1_PROMPT)
            elif mode == 'step_2':
                return self.prompt_invoke(query=query.data,prompt=STEP_2_PROMPT)
            else:
                return ErrorBaseModel(success=False,error="TypeError: Mode not specified properly. It's either 'step_1' or 'step_2' ")
        except Exception as e:
            return ErrorBaseModel(success=False,error=str(e))

        
    
    
        