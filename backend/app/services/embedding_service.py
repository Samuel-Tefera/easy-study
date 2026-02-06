import requests
import time
from typing import List
from sqlalchemy.orm import Session
from app.repositories.embedding_repository import EmbeddingRepository
from app.core.config import settings


class EmbeddingService:
    headers = {
        "Authorization": f"Bearer {settings.HF_API_KEY}"
    }

    @classmethod
    def create_embeddings(cls, db: Session, chunks: List[dict], batch_size: int = 20) -> None:
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i : i + batch_size]
            texts = [c["text"] for c in batch]

            all_vectors = None
            for attempt in range(3):
                try:
                    response = requests.post(
                        settings.HF_API_URL,
                        headers=cls.headers,
                        json={"inputs": texts, "options": {"wait_for_model": True}},
                        timeout=60
                    )
                    if response.status_code == 200:
                        all_vectors = response.json()
                        break
                except Exception as e:
                    print(f"Attempt {attempt+1} failed: {e}")

                time.sleep(2)

            if not all_vectors or response.status_code != 200:
                raise Exception(f"Failed to process batch starting at index {i}")

            if isinstance(all_vectors[0], list) and isinstance(all_vectors[0][0], list):
                all_vectors = [v[0] for v in all_vectors]

            vectors_to_save = [
                {"chunk_id": batch[j]["chunk_id"], "vector": all_vectors[j]}
                for j in range(len(batch))
            ]

            EmbeddingRepository.bulk_create_embeddings(db, vectors_to_save)
