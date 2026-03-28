from fastapi import APIRouter, HTTPException, UploadFile, Depends, File, BackgroundTasks

from sqlalchemy.orm import Session

from uuid import UUID

from app.models.user import User
from app.services.storage_service import storage_service
from app.db.database import get_db
from app.utils.utils import get_page_count
from app.core.deps import get_current_user
from app.repositories.document_repository import DocumentRepository
from app.schemas.document import DocumentOut, DocumentSummaryOut
from app.utils.utils import process_document_task
from app.services.document_service import DocumentService


router = APIRouter(prefix="/documents", tags=["document"])

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


@router.delete("/{document_id}")
def delete_document(
    document_id: UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = DocumentRepository.get_document_by_id(db, document_id)

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    if not document.user_id == user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    try:
        storage_service.delete_file(document.filename)
    except Exception as e:
        print(f"Warning: Storage deletion failed for {document.filename}: {e}")

    if DocumentRepository.delete_document(db, document_id):
        return {"message": "Document and all related data deleted"}

@router.post("/{document_id}/summary", response_model=DocumentSummaryOut)
def generate_document_summary_endpoint(
    document_id: UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    document = DocumentRepository.get_document_by_id(db, document_id)
    if not document or document.user_id != user.id:
        raise HTTPException(status_code=404, detail="Document not found")

    if document.summary:
        return {"summary": document.summary, "message": "Summary already created"}

    try:
        summary = DocumentService.generate_document_summary(db, document_id)
        return {"summary": summary, "message": "Summary generated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{document_id}/summary", response_model=DocumentSummaryOut)
def get_document_summary_endpoint(
    document_id: UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    document = DocumentRepository.get_document_by_id(db, document_id)
    if not document or document.user_id != user.id:
        raise HTTPException(status_code=404, detail="Document not found")

    if not document.summary:
        raise HTTPException(status_code=404, detail="Summary not generated yet")

    return {"summary": document.summary, "message": "Summary retrieved from storage"}
