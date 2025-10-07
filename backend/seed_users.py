from database import SessionLocal
import models
from auth import get_password_hash

users = [
    {"login": "ironman", "password": "9fX2pQ", "role": "user", "avatar_url": "https://img.icons8.com/color/48/iron-man.png"},
    {"login": "batman", "password": "7vLk1z", "role": "admin", "avatar_url": "https://img.icons8.com/color/48/batman.png"},
    {"login": "superman", "password": "3bTq8R", "role": "user", "avatar_url": "https://img.icons8.com/color/48/superman.png"},
    {"login": "spiderman", "password": "6nWm5J", "role": "user", "avatar_url": "https://img.icons8.com/color/48/spiderman-head.png"},
    {"login": "hulk", "password": "2sYp7C", "role": "user", "avatar_url": "https://img.icons8.com/color/48/hulk.png"},
    {"login": "thor", "password": "8dQw4K", "role": "user", "avatar_url": "https://img.icons8.com/color/48/thor.png"},
    {"login": "captain", "password": "5jZr2V", "role": "user", "avatar_url": "https://img.icons8.com/color/48/captain-america.png"},
    {"login": "wolverine", "password": "1kLp9X", "role": "user", "avatar_url": "https://img.icons8.com/color/48/wolverine.png"},
    {"login": "flash", "password": "4mNs6B", "role": "user", "avatar_url": "https://img.icons8.com/color/48/flash.png"},
    {"login": "wonderwoman", "password": "0tVb3S", "role": "user", "avatar_url": "https://img.icons8.com/color/48/wonder-woman.png"},
]

db = SessionLocal()
added = 0
for u in users:
    if not db.query(models.User).filter(models.User.login == u["login"]).first():
        user = models.User(
            login=u["login"],
            hashed_password=get_password_hash(u["password"]),
            avatar_url=u.get("avatar_url"),
            role=u["role"]
        )
        db.add(user)
        added += 1
db.commit()
db.close()
print(f"Готово! Добавлено пользователей: {added}")