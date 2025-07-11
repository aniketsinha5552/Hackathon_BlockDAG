from fastapi import FastAPI
from routes_chat import router as chat_router
from routes_contract import router as contract_router

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "MetaDAG backend is running!"}

app.include_router(chat_router)
app.include_router(contract_router) 