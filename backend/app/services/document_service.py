import fitz  # PyMuPDF
from pptx import Presentation
from io import BytesIO


class DocumentService:

    @staticmethod
    def extract_text(file_bytes: bytes, filename: str) -> str:
        suffix = filename.lower().split(".")[-1]

        if suffix == "pdf":
            return DocumentService._extract_pdf_text(file_bytes)
        elif suffix in ["pptx", "ppt"]:
            return DocumentService._extract_ppt_text(file_bytes)
        else:
            raise ValueError("Unsupported file format")

    @staticmethod
    def _extract_pdf_text(file_bytes: bytes) -> str:
        text = []
        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            for page in doc:
                text.append(page.get_text())
        return DocumentService._clean_text("\n".join(text))

    @staticmethod
    def _extract_ppt_text(file_bytes: bytes) -> str:
        prs = Presentation(BytesIO(file_bytes))
        text = []

        for slide in prs.slides:
            for shape in slide.shapes:
                if hasattr(shape, "text") and shape.text.strip():
                    text.append(shape.text.strip())

                if shape.has_table:
                    for row in shape.table.rows:
                        row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                        if row_text:
                            text.append(" | ".join(row_text))

        return DocumentService._clean_text("\n".join(text))

    @staticmethod
    def _clean_text(text: str) -> str:
        text = text.replace("\n\n", "\n")
        return text.strip()
