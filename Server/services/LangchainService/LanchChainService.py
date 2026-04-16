# Server/services/LangchainService/LanchChainService.py

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from schemas.BaseModelSchemas import ErrorBaseModel
from .tools.LangchainAgentTools import AdditionTool
from .prompts.BasePrompts import STEP_1_PROMPT, STEP_2_PROMPT
import os
import re
import json

load_dotenv()

MAX_HISTORY = 20


class Langchain_Service:
    def __init__(self):
        self.tools = [AdditionTool]

        model_name = os.getenv("GOOGLE_AI_MODEL")
        api_key = os.getenv("GOOGLE_API_KEY")

        print("DEBUG MODEL:", model_name)
        print("DEBUG KEY EXISTS:", bool(api_key))

        if not model_name:
            raise ValueError("GOOGLE_AI_MODEL is missing")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY is missing")

        self.llm = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=api_key,
            temperature=0.2,
        )

        self.memory = {"chat_history": []}

    @staticmethod
    def parse_llm_json(raw_text: str):
        if not raw_text:
            return {}

        cleaned = re.sub(r"```(?:json)?", "", raw_text, flags=re.IGNORECASE).strip()

        if cleaned.startswith('"') and cleaned.endswith('"'):
            cleaned = cleaned[1:-1]

        try:
            cleaned = cleaned.encode("utf-8").decode("unicode_escape")
        except Exception:
            pass

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            return {"data": cleaned}

    def _prompt_invoke_step_one(self, query, prompt=STEP_1_PROMPT):
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", prompt),
            ("human", "{user_message}")
        ])

        chain = prompt_template | self.llm
        output = chain.invoke({"user_message": query})

        return self.parse_llm_json(output.content)

    def _prompt_invoke_step_two(self, query, scored_food_list, prompt=STEP_2_PROMPT):
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", prompt),
            ("human", "User query: {user_query}\nScored food list: {scored_food_list}")
        ])

        chain = prompt_template | self.llm
        output = chain.invoke({
            "user_query": query,
            "scored_food_list": json.dumps(scored_food_list)
        })

        return self.parse_llm_json(output.content)

    def step_one(self, query):
        try:
            return self._prompt_invoke_step_one(query=query.data)
        except Exception as e:
            return ErrorBaseModel(success=False, error=str(e))

    def step_two(self, user_prompt, scored_food_list):
        try:
            return self._prompt_invoke_step_two(
                query=user_prompt,
                scored_food_list=scored_food_list
            )
        except Exception as e:
            return ErrorBaseModel(success=False, error=str(e))

    def invoke_agent(self, query: str):
        try:
            self.memory["chat_history"].append({"user": query})

            if len(self.memory["chat_history"]) > MAX_HISTORY:
                self.memory["chat_history"] = self.memory["chat_history"][-MAX_HISTORY:]

            response = self.llm.invoke(query)
            response_text = response.content if hasattr(response, "content") else str(response)

            self.memory["chat_history"].append({"ai": response_text})

            if len(self.memory["chat_history"]) > MAX_HISTORY:
                self.memory["chat_history"] = self.memory["chat_history"][-MAX_HISTORY:]

            return response_text

        except Exception as e:
            return {"success": False, "error": str(e)}