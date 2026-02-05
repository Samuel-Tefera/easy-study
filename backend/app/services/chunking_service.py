import re
from typing import List


class ChunkingService:
    CHUNK_SIZE = 800        # max characters per chunk
    CHUNK_OVERLAP = 150     # overlap between chunks

    @staticmethod
    def split_text(text: str) -> List[str]:
        if not text:
            return []

        sentences = ChunkingService._split_into_sentences(text)
        chunks = []
        current_chunk = ""

        for sentence in sentences:
            if len(sentence) > ChunkingService.CHUNK_SIZE:
                sentence = sentence[:ChunkingService.CHUNK_SIZE]

            if len(current_chunk) + len(sentence) <= ChunkingService.CHUNK_SIZE:
                current_chunk += sentence + " "
            else:
                chunks.append(current_chunk.strip())

                raw_overlap = current_chunk[-ChunkingService.CHUNK_OVERLAP:]
                overlap_start = raw_overlap.find(" ")
                clean_overlap = raw_overlap[overlap_start:] if overlap_start != -1 else raw_overlap

                current_chunk = (clean_overlap.strip() + " " + sentence + " ").lstrip()

        if current_chunk:
            chunks.append(current_chunk.strip())

        return chunks


    @staticmethod
    def _split_into_sentences(text: str) -> List[str]:
        sentence_endings = re.compile(r'(?<=[.!?]) +')
        return [s for s in sentence_endings.split(text) if s.strip()]
