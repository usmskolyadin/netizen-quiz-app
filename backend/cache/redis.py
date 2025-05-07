from aiogram.contrib.fsm_storage.redis import RedisStorage2

storage = RedisStorage2(host='redis', port=6379, db=2)
dp = Dispatcher(bot, storage=storage)