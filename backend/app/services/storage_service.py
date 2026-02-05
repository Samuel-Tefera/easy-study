import tempfile
import mimetypes
from typing import List
from app.core.config import settings
from supabase import create_client, Client

class StorageService:
    def __init__(self, bucket: str = "documents"):
        self.client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )
        self.bucket_name = bucket

    @property
    def bucket(self):
        return self.client.storage.from_(self.bucket_name)

    def upload_file(self, file_bytes: bytes, filename: str) -> str:
        content_type = mimetypes.guess_type(filename)[0] or "application/octet-stream"

        try:
            self.bucket.upload(
                path=filename,
                file=file_bytes,
                file_options={"content-type": content_type, "upsert": "true"},
            )
            return self.bucket.get_public_url(filename)
        except Exception as e:
            raise RuntimeError(f"Supabase upload failed: {str(e)}")

    def download_to_temp(self, filename: str) -> str:
        try:
            file_bytes = self.bucket.download(filename)
            suffix = f".{filename.split('.')[-1]}" if "." in filename else ""

            temp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
            temp.write(file_bytes)
            temp.close()
            return temp.name
        except Exception as e:
            raise RuntimeError(f"Failed to download file: {str(e)}")

    def delete_file(self, filename: str) -> None:
        try:
            self.bucket.remove([filename])
        except Exception as e:
            raise RuntimeError(f"Delete failed: {str(e)}")
