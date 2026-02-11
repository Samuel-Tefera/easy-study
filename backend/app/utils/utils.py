import io
from pypdf import PdfReader
from pptx import Presentation
from urllib.parse import urlparse

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


def extract_path_from_supabase_url(file_url: str) -> str:
    parsed = urlparse(file_url)
    path_parts = parsed.path.split("/")

    try:
        bucket_index = path_parts.index("documents")
    except ValueError:
        raise ValueError("Invalid Supabase file URL format")

    object_path = "/".join(path_parts[bucket_index + 1 :])

    return object_path

