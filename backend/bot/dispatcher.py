from aiogram import Dispatcher

class TelegramBotDispatcher:
    def __init__(self):
        self.dp = Dispatcher()

    async def dispatch(self, update: dict):
        await self.dp.process_update(update)