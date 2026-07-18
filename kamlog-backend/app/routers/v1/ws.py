# app/routers/v1/ws.py  Version 1 ws Router
from app.routers import ws as ws_v0

# Re-export the router for version 1
router = ws_v0.router

# Also re-export any other public items if needed
from app.routers.ws import *  # noqa: F401,F403