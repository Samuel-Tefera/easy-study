import textwrap
import logging
from uuid import UUID
from sqlalchemy.orm import Session

from app.services.retrieval_service import RetrievalService
from app.services.llm_service import LLMService
from app.models.ai_interaction import AIActionType
from app.utils.utils import load_highlight_prompt

logger = logging.getLogger(__name__)

class RAGService:
    @staticmethod
    def process_highlight(
        db: Session,
        document_id: UUID,
        selected_text: str,
        action: AIActionType,
        top_k: int = 5
    ) -> str:
        chunks = RetrievalService.get_similar_chunks(
            db=db,
            document_id=document_id,
            query=selected_text,
            top_k=top_k
        )

        if not chunks:
            return "I couldn't find relevant information in this document."

        context = "\n\n---\n\n".join(chunks)

        template = load_highlight_prompt(action.value)


        prompt = (
            template
            .replace("{{context}}", context)
            .replace("{{selected_text}}", selected_text)
        )

        try:
            answer = LLMService.generate(prompt)
            return answer.strip()
        except Exception as e:
            logger.error(f"Error generating RAG answer: {e}")
            return "I'm sorry, I encountered an error while processing your request."
