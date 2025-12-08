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

MAX_HISTORY = 20 

class Langchain_Service:
    def __init__(self):
        self.tools = [AdditionTool]
        self.llm = GoogleGenerativeAI(model = os.getenv('GOOGLE_AI_MODEL'))    
        self.memory = {"chat_history": []}   
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
            return {"data": cleaned}
        
        
    def _prompt_invoke_step_one(self,query,prompt=STEP_1_PROMPT):
        prompt = ChatPromptTemplate.from_messages([
            ("system",prompt),
            ("human","{user_message}")
        ])
        chain = prompt | self.llm
        output = chain.invoke({"user_message":query})
        return self.parse_llm_json(output)
    
    def _prompt_invoke_step_two(self,query,scored_food_list,prompt=STEP_2_PROMPT):
        prompt = ChatPromptTemplate.from_messages([
            ("system",prompt)
        ])
        chain = prompt | self.llm
        output = chain.invoke({"scored_food_list":scored_food_list,"user_query":query})
        return self.parse_llm_json(output)
    
    def step_one(self,query):
        try:
            return self._prompt_invoke_step_one(query=query.data)
        except Exception as e:
            return ErrorBaseModel(success=False,error=str(e))
    
    def step_two(self,user_prompt,scored_food_list):
        try:
            return self._prompt_invoke_step_two(query=user_prompt,scored_food_list=scored_food_list)
        except Exception as e:
            return ErrorBaseModel(success=False,error=str(e))
        
    def invoke_agent(self, query: str):
        try:
            self.memory["chat_history"].append({"user": query})
            
            # Keep only the last MAX_HISTORY items
            if len(self.memory["chat_history"]) > MAX_HISTORY:
                self.memory["chat_history"] = self.memory["chat_history"][-MAX_HISTORY:]

            response = self.llm.invoke(query)
            self.memory["chat_history"].append({"ai": response})

            if len(self.memory["chat_history"]) > MAX_HISTORY:
                self.memory["chat_history"] = self.memory["chat_history"][-MAX_HISTORY:]

            return response
        except Exception as e:
            return {"success": False, "error": str(e)}
        
    
    
        