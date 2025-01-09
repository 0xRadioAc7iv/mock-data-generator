from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="Mock Data Generator")

app.include_router(router=router)