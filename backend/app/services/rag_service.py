import textwrap
import logging
from uuid import UUID
from sqlalchemy.orm import Session
from app.services.retrieval_service import RetrievalService
from app.services.llm_service import LLMService

logger = logging.getLogger(__name__)

class RAGService:
    @staticmethod
    def answer_question(
        db: Session,
        document_id: UUID,
        question: str,
        top_k: int = 5
    ) -> str:
        chunks = RetrievalService.get_similar_chunks(
            db=db,
            document_id=document_id,
            query=question,
            top_k=top_k
        )

        if not chunks:
            return "I couldn't find relevant information in this document."

        context = "\n\n---\n\n".join(chunks)

        prompt = textwrap.dedent(f"""
            You are an academic tutor helping a student understand their study material.

            You MUST answer using ONLY the information from the provided context.
            If the answer cannot be found in the context, say:
            "I don't see this information in the document."

            Be clear, simple, and educational.

            CONTEXT:
            {context}

            QUESTION:
            {question}

            ANSWER:
        """).strip()

        try:
            answer = LLMService.generate(prompt)
            return answer.strip()
        except Exception as e:
            logger.error(f"Error generating RAG answer: {e}")
            return "I'm sorry, I encountered an error while processing your request."
