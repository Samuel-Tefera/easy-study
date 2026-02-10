from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from app.models.chunk import Chunk


class ChunkRepository:

    @staticmethod
    def bulk_create_chunks(
        db: Session,
        document_id: UUID,
        chunks: List[str],
    ) -> List[Chunk]:
        """
        Inserts multiple chunks efficiently.
        `chunks` is a list of chunk texts in order.
        """

        chunk_objects = [
            Chunk(
                document_id=document_id,
                chunk_index=index,
                text=text,
            )
            for index, text in enumerate(chunks)
        ]

        db.add_all(chunk_objects)
        db.commit()

        # Refresh to get generated IDs
        for chunk in chunk_objects:
            db.refresh(chunk)

        return chunk_objects

    @staticmethod
    def get_chunks_by_document(
        db: Session,
        document_id: UUID,
    ) -> List[Chunk]:
        return (
            db.query(Chunk)
            .filter(Chunk.document_id == document_id)
            .order_by(Chunk.chunk_index)
            .all()
        )

    @staticmethod
    def delete_chunks_by_document(
        db: Session,
        document_id: UUID,
    ) -> int:
        deleted = (
            db.query(Chunk)
            .filter(Chunk.document_id == document_id)
            .delete()
        )
        db.commit()
        return deleted
