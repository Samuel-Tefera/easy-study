from sqlalchemy.orm import Session
from uuid import UUID
from app.models.document import Document


class DocumentRepository:

    @staticmethod
    def create_document(
        db: Session,
        user_id: UUID,
        filename: str,
        file_url: str,
        pages: int | None = None,
    ) -> Document:
        document = Document(
            user_id=user_id,
            filename=filename,
            file_url=file_url,
            pages=pages,
        )
        db.add(document)
        db.commit()
        db.refresh(document)
        return document

    @staticmethod
    def get_document_by_id(db: Session, document_id: UUID) -> Document | None:
        return db.query(Document).filter(Document.id == document_id).first()

    @staticmethod
    def get_documents_by_user(db: Session, user_id: UUID) -> list[Document]:
        return db.query(Document).filter(Document.user_id == user_id).all()

    @staticmethod
    def delete_document(db: Session, document_id: UUID) -> bool:
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            return False

        db.delete(document)
        db.commit()
        return True
