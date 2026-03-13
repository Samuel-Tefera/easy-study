from sqlalchemy.orm import Session

from uuid import UUID

from app.models.ai_interaction import AIActionType, AIInteractionType
from app.models.ai_interaction import AIInteraction

class AIInteractionRepository:

  @staticmethod
  def create_ai_interaction(
    db: Session,
    user_id: UUID,
    document_id: UUID,
    interaction_type: AIInteractionType,
    action: AIActionType,
    input_text: str,
    response_text: str,
  ) -> AIInteraction:
    ai_interaction = AIInteraction(
      user_id=user_id,
      document_id=document_id,
      interaction_type=interaction_type,
      action=action,
      input_text=input_text.replace("\x00", "") if input_text else input_text,
      response_text=response_text.replace("\x00", "") if response_text else response_text
    )

    db.add(ai_interaction)
    db.commit()
    db.refresh(ai_interaction)

    return ai_interaction

  @staticmethod
  def get_ai_interaction_for_document(
    db: Session,
    document_id: UUID
  ) -> list[AIInteraction] | None:
    return (
        db.query(AIInteraction)
        .filter(AIInteraction.document_id == document_id)
        .order_by(AIInteraction.created_at.asc())
        .all()
      )

  @staticmethod
  def delete_ai_interaction(
    db: Session,
    ai_interaction_id: UUID
  ) -> bool:
    ai_interaction = db.query(AIInteraction).filter(AIInteraction.id == ai_interaction_id).first()

    if not ai_interaction:
      return False

    db.delete(ai_interaction)
    db.commit()

    return True
