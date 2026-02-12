import io
from pypdf import PdfReader
from pptx import Presentation
from urllib.parse import urlparse
from uuid import UUID
from sqlalchemy.orm import Session

from app.services.document_service import DocumentService
from app.services.chunking_service import ChunkingService
from app.repositories.chunk_repository import ChunkRepository
from app.models.document import DocumentStatus
from app.services.embedding_service import EmbeddingService
from app.repositories.document_repository import DocumentRepository


def get_page_count(file_bytes: bytes, filename: str) -> int:
    file_stream = io.BytesIO(file_bytes)

    try:
        # Handle PDF
        if filename.lower().endswith(".pdf"):
            reader = PdfReader(file_stream)
            return len(reader.pages)

        # Handle PPTX
        if filename.lower().endswith(".pptx"):
            prs = Presentation(file_stream)
            return len(prs.slides)

    except Exception as e:
        print(f"Error parsing {filename}: {e}")

    return 0

def process_document_task(db: Session, document_id: UUID, file_bytes: bytes, filename: str):
    try:
        # 1. EXTRACT TEXT
        document_text = DocumentService.extract_text(file_bytes, filename)

        # 2. GENERATE CHUNKS
        document_chunks = ChunkingService.split_text(document_text)

        # 3. SAVE CHUNKS TO DB
        chunks = ChunkRepository.bulk_create_chunks(
            db, document_id, document_chunks
        )

        EmbeddingService.create_embeddings(db, chunks)

        DocumentRepository.update_document_status(
            db, document_id, DocumentStatus.ready
        )
    except Exception as e:
        print(f"Error processing document {document_id}: {e}")
        DocumentRepository.update_document_status(
            db, document_id, DocumentStatus.failed
        )

def extract_path_from_supabase_url(file_url: str) -> str:
    parsed = urlparse(file_url)
    path_parts = parsed.path.split("/")

    try:
        bucket_index = path_parts.index("documents")
    except ValueError:
        raise ValueError("Invalid Supabase file URL format")

    object_path = "/".join(path_parts[bucket_index + 1 :])

    return object_path
