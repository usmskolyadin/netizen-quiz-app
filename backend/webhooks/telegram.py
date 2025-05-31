from fastapi import APIRouter, HTTPException, Request
from telegram.ext import Application
from dotenv import load_dotenv
import os
from telegram.ext import Application, CommandHandler, MessageHandler, filters
from telegram import Update

from bot.handlers.start import start, echo
from core.config import settings

load_dotenv()

messages_db = []

bot_app = Application.builder().token(settings.telegram_api_key).build()
bot_app.add_handler(CommandHandler("start", start))
bot_app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))


router = APIRouter()
@router.post("/api/send_message")
async def send_message(request: Request):
    data = await request.json()
    chat_id = data.get("chat_id")
    text = data.get("text")
    
    if not chat_id or not text:
        raise HTTPException(status_code=400, detail="Необходимы chat_id и text")
    
    await bot_app.bot.send_message(chat_id=chat_id, text=text)
    return {"status": "Сообщение отправлено"}

@router.get("/api/messages")
async def get_messages():
    return {"messages": messages_db}

@router.post("/webhook")
async def webhook(update: dict):
    try:
        async with bot_app:
            await bot_app.process_update(Update.de_json(update, bot_app.bot))
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

