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

        data = response.json()

        return data.get("choices", [{}])[0].get("message", {}).get("content", "")
