"""Vercel serverless function entrypoint.

Mounts the existing FastAPI backend under /api so that Vercel routes
like /api/chat, /api/health, etc. are forwarded correctly to the
backend's routes (/chat, /health, …).
"""

import sys
import os

# Make the backend package importable (bare imports like `from models import …`)
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "bitmark-ai-chat-backend")
sys.path.insert(0, backend_dir)

from fastapi import FastAPI

# Import the real FastAPI application from the backend
from main import app as backend_app  # noqa: E402

# Wrapper app: Vercel delivers the full path (e.g. /api/chat) to the
# ASGI handler.  Mounting the backend at "/api" lets Starlette strip
# the prefix so the backend's @app.post("/chat") route matches.
app = FastAPI()
app.mount("/api", backend_app)
