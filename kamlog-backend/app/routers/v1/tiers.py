# app/routers/v1/tiers.py  Version 1 tiers Router
from app.routers import tiers as tiers_v0

# Re-export the router for version 1
router = tiers_v0.router

# Also re-export any other public items if needed
from app.routers.tiers import *  # noqa: F401,F403
