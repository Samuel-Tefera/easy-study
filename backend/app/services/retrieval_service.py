from typing import List
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.chunk import Chunk
from app.models.embedding import Embedding
from app.services.embedding_service import EmbeddingService

class RetrievalService:
    @staticmethod
    def get_similar_chunks(
        db: Session,
        document_id: UUID,
        query: str,
        top_k: int = 5
    ) -> List[str]:

        query_vector = EmbeddingService.embed_query(query)

        results = (
            db.query(Chunk.text)
            .join(Embedding, Embedding.chunk_id == Chunk.id)
            .filter(Chunk.document_id == document_id)
            .order_by(Embedding.vector.cosine_distance(query_vector))
            .limit(top_k)
            .all()
        )

        return [r[0] for r in results]
