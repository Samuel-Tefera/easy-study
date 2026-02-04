from app.db.database import Base, engine
from app.models.user import User
from app.models.chunk import Chunk
from app.models.document import Document
from app.models.embedding import Embedding


def init_db():
  print("Creating Tables...")
  Base.metadata.create_all(bind=engine)
  print("Database successfully initialized.")


if __name__ == "__main__":
  init_db()
