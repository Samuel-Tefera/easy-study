from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.deps import get_current_user
from app.schemas.ai import AIHighlightRequest, AIHighlightResponse
from app.services.rag_service import RAGService
from app.models.ai_interaction import AIInteractionType
from app.models.user import User
from app.repositories.ai_interaction_repository import AIInteractionRepository


router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/highlight", response_model=AIHighlightResponse)
def highlight_text(
    request: AIHighlightRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
  ):

  response = RAGService.process_highlight(
    db,
    request.document_id,
    request.selected_text,
    request.action
  )

  ai_interaction = AIInteractionRepository.create_ai_interaction(
    db,
    user.id,
    request.document_id,
    AIInteractionType.highlight,
    request.action,
    request.selected_text,
    response
  )

  return ai_interaction
