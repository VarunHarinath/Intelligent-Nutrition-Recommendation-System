from fastapi import FastAPI
from routes.DataInputRoute import DataInputRoute
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Intelligent-Nutrition-Recommendation-System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def home():
    return "Hello world"

app.include_router(DataInputRoute)