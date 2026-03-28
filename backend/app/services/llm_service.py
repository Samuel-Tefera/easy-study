import requests
from app.core.config import settings


class LLMService:
    API_URL = settings.LLM_API_URL
    MODEL = settings.LLM_MODEL

    HEADERS = {
        "Authorization": f"Bearer {settings.LLM_API_KEY}",
        "Content-Type": "application/json"
    }

    @classmethod
    def generate(cls, prompt: str) -> str:
        payload = {
            "model": cls.MODEL,
            "messages": [
                {"role": "system", "content": "You are an expert tutor. Provide direct, focused answers using Markdown formatting. You MUST use bold text to emphasize key terms, and bullet points or numbered lists to break down multiple concepts. However, DO NOT overuse them for random words. Never use introductory phrases like 'Based on the context...', 'As a tutor...', or 'I can help you with that...'. Jump straight to the explanation, definition, or answer requested."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 800
        }

        response = requests.post(
            cls.API_URL,
            headers=cls.HEADERS,
            json=payload,
            timeout=120
        )

        response.raise_for_status()

        return data.get("choices", [{}])[0].get("message", {}).get("content", "")

    @classmethod
    def generate_summary(cls, text: str) -> str:
        system_prompt = (
            "You are an expert tutor. Provide a comprehensive, structured, and interactive summary of the provided text. "
            "Use Markdown formatting, bold key terms, use bullet points, and clear headings. "
            "Ensure everything a user needs to know to ace an exam on this topic is included. Be concise to save tokens but highly informative."
        )

        # Limiting input text length to avoid excessive token usage
        max_chars = 120000
        truncated_text = text[:max_chars] if len(text) > max_chars else text

        payload = {
            "model": cls.MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Summarize this document comprehensively into key points:\n\n{truncated_text}"}
            ],
            "temperature": 0.3,
            "max_tokens": 1500
        }

        response = requests.post(
            cls.API_URL,
            headers=cls.HEADERS,
            json=payload,
            timeout=180
        )

        response.raise_for_status()
        data = response.json()
        return data.get("choices", [{}])[0].get("message", {}).get("content", "")
