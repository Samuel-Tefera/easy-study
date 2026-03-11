from fastapi import FastAPI
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api import auth, user
from app.api import document
from app.api import ai

from app.core.config import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.ALLOWED_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=auth.router, prefix="/api")
app.include_router(router=user.router, prefix="/api")
app.include_router(router=document.router, prefix="/api")
app.include_router(router=ai.router, prefix="/api")

@app.get("/")
def health_check():
  return {"message": "Easy study running"}

@app.get("/db-test")
def test_db(db: Session = Depends(get_db)):
  return {"status": "connected"}
