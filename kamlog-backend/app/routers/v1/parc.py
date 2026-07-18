# app/routers/v1/parc.py  Version 1 parc Router
from app.routers import parc as parc_v0

# Re-export the router for version 1
router = parc_v0.router

# Also re-export any other public items if needed
from app.routers.parc import *  # noqa: F401,F403
