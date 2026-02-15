from fastapi import FastAPI
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api import auth, user
from app.api import document
from app.api import ai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5173",
        "http://localhost:5174",
    ],
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
