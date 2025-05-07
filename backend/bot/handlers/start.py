from telegram import Update


messages_db = []

async def start(update: Update, context):
    await update.message.reply_text("Привет! Я бот на FastAPI")

async def echo(update: Update, context):
    text = update.message.text
    messages_db.append({"user": update.message.from_user.id, "text": text})
    await update.message.reply_text(f"Вы сказали: {text}")