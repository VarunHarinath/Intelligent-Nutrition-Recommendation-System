from fastapi import FastAPI
from routes.DataInputRoute import DataInputRoute
from fastapi.middleware.cors import CORSMiddleware
from routes.AiChatRoute import AiChatRoute

app = FastAPI(title="Intelligent-Nutrition-Recommendation-System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def home():
    return "Hello world"

app.include_router(DataInputRoute)
app.include_router(AiChatRoute)