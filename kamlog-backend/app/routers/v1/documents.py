# app/routers/v1/documents.py  Version 1 documents Router
from app.routers import documents as documents_v0

# Re-export the router for version 1
router = documents_v0.router

# Also re-export any other public items if needed
from app.routers.documents import *  # noqa: F401,F403
