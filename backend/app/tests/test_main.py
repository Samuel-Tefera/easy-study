from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    """
    Test the health check endpoint to ensure the API is running.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Easy study running"}
