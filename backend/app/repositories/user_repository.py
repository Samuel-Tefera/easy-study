from sqlalchemy.orm import Session
from app.models.user import User


class UserRepository:

    @staticmethod
    def create_user(db: Session, name: str, email: str) -> User:
        user = User(name=name, email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User | None:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_id(db: Session, user_id) -> User | None:
        return db.query(User).filter(User.id == user_id).first()
