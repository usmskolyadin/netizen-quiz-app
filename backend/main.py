from fastapi import FastAPI
from webhooks.telegram import router as webhook_router
from webhooks.telegram import router as webhook_router
from fastapi.middleware.cors import CORSMiddleware
from db.connection import postgres as cn

app = FastAPI()
app.include_router(webhook_router)
app.include_router(webhook_router)
app.include_router(webhook_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("api/quizes/{tg_id}")
async def quizes(tg_id: int):
    user = await cn.get_user(tg_id=tg_id)
    return await cn.get_quizes()




    