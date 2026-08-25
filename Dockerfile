# Stage 1: Build the frontend React app
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source files and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Set up the Python FastAPI backend
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Install build dependencies if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file first to leverage Docker caching
COPY backend/requirements.txt /app/backend/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy all project directories and files
COPY . .

# Copy compiled frontend build assets from Stage 1 into the container
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose port 8000 for access
EXPOSE 8000

# Set PYTHONPATH
ENV PYTHONPATH=/app

# Start the application using Uvicorn, binding to all interfaces
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
