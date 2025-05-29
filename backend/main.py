from fastapi import FastAPI
from webhooks.telegram import router as webhook_router
from webhooks.telegram import router as webhook_router
from fastapi.middleware.cors import CORSMiddleware


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