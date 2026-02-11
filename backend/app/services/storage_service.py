import tempfile

import mimetypes

from supabase import create_client, Client

from app.core.config import settings
from app.utils.utils import extract_path_from_supabase_url

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

    def create_signed_url_from_full_url(self, file_url: str, expires_in: int = 300) -> str:
        file_path = extract_path_from_supabase_url(file_url)

        response = self.bucket.create_signed_url(file_path, expires_in)

        signed = response.get("signedURL")
        if not signed:
            raise RuntimeError("Failed to generate signed URL")

        if signed.startswith("http"):
            return signed

        return f"{settings.SUPABASE_URL}{signed}"


storage_service = StorageService()
