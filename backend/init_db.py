from database import Base, engine
import models

print("Создаём таблицы...")
Base.metadata.create_all(bind=engine)
print("Готово!")