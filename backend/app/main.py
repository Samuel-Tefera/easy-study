from fastapi import FastAPI
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.database import get_db

app = FastAPI()

@app.get("/")
def health_check():
  return {"message": "Easy study running"}

@app.get("/db-test")
def test_db(db: Session = Depends(get_db)):
  return {"status": "connected"}
