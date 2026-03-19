#!/bin/bash

# Run migrations
echo "Running database migrations..."
alembic upgrade head

# Start the application
echo "Starting FastAPI server..."
export PYTHONPATH=$PYTHONPATH:.
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --proxy-headers
