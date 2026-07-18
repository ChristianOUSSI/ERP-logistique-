# app/routers/v1/rh.py  Version 1 rh Router
from app.routers import rh as rh_v0

# Re-export the router for version 1
router = rh_v0.router

# Also re-export any other public items if needed
from app.routers.rh import *  # noqa: F401,F403
