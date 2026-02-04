from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from app.models.embedding import Embedding


class EmbeddingRepository:

    @staticmethod
    def create_embedding(
        db: Session,
        chunk_id: UUID,
        vector: List[float],
    ) -> Embedding:
        embedding = Embedding(
            chunk_id=chunk_id,
            vector=vector,
        )
        db.add(embedding)
        db.commit()
        db.refresh(embedding)
        return embedding

    @staticmethod
    def bulk_create_embeddings(
        db: Session,
        embeddings: List[dict],
    ) -> None:
        """
        embeddings = [
            {"chunk_id": UUID, "vector": [...]},
            {"chunk_id": UUID, "vector": [...]}
        ]
        """

        objects = [
            Embedding(chunk_id=e["chunk_id"], vector=e["vector"])
            for e in embeddings
        ]

        db.add_all(objects)
        db.commit()

    @staticmethod
    def get_embeddings_by_document(
        db: Session,
        document_id: UUID,
    ):
        return (
            db.query(Embedding)
            .join(Embedding.chunk)
            .filter(Embedding.chunk.has(document_id=document_id))
            .all()
        )
