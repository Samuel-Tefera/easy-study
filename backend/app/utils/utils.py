import io
from pypdf import PdfReader
from pptx import Presentation

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
