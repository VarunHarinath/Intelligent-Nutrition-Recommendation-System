from fastapi import FastAPI
from routes.DataInputRoute import DataInputRoute

app = FastAPI(title="Intelligent-Nutrition-Recommendation-System")

@app.get('/')
def home():
    return "Hello world"

app.include_router(DataInputRoute)