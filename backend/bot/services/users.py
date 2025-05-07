from db.repositories.users import UserRepository

class UserService:
    def __init__(self):
        self.repo = UserRepository()

    async def get_user(self, user_id: int):
        return await self.repo.get_by_id(user_id)