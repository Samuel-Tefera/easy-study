from fastapi import APIRouter, HTTPException, UploadFile, Depends, File, BackgroundTasks

from sqlalchemy.orm import Session

from uuid import UUID

from app.models.user import User
from app.services.storage_service import storage_service
from app.db.database import get_db
from app.utils.utils import get_page_count
from app.core.deps import get_current_user
from app.repositories.document_repository import DocumentRepository
from app.services.document_service import DocumentService
from app.services.chunking_service import ChunkingService
from app.repositories.chunk_repository import ChunkRepository
from app.models.document import DocumentStatus, Document
from app.schemas.document import DocumentOut
from app.services.embedding_service import EmbeddingService

router = APIRouter(prefix="/documents", tags=["document"])

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

@router.post("/upload", response_model=DocumentOut)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    filename = file.filename
    file_bytes = await file.read()

    file_url = storage_service.upload_file(file_bytes, filename)
    pages = get_page_count(file_bytes, filename)

    document = DocumentRepository.create_document(
        db, user.id, filename, file_url, pages
    )

    background_tasks.add_task(
        process_document_task, db, document.id, file_bytes, filename
    )

    return document

@router.get("/", response_model=list[DocumentOut])
def get_documents(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    documents = DocumentRepository.get_documents_by_user(db, user.id)
    return documents

@router.get("/{document_id}/view-url")
def get_document_view_url(
    document_id: UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    document = DocumentRepository.get_document_by_id(db, document_id)

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    if document.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    signed_url = storage_service.create_signed_url_from_full_url(document.file_url)

    return {"url": signed_url}

